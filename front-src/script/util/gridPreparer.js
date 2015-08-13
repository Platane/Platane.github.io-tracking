

const literalMonth = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const duration = {
    'minute' : 60,
    'hour' : 3600,
    'day' : 24 * 3600,
    // 'week' : 7 * 24 * 3600,
    'month' : 30.5 * 24 * 3600,
    'year' : 12 * 30.5 * 24 * 3600,
}
const sortedDuration = Object.keys( duration )
    .map( x =>
        ({
            label: x,
            duration: duration[ x ],
        }))
    .sort( (a,b) =>
        a.duration > b.duration ? 1 : -1 )

const availableIntervalles = [
    60,
    5*60,
    15*60,

    3600,
    2*3600,
    6*3600,
    12*3600,

    24*3600,
    2*24*3600,
    7*24*3600,

    2*7*24*3600,

    30.5*24*3600,

    2*30.5*24*3600,
    3*30.5*24*3600,

    6*30.5*24*3600,

    12*30.5*24*3600,
]

export const labelDate = ( unit, date, lastDate ) => {

    let label = ''
    switch( unit ) {
        case 'minutes':
            label = date.getHours() +'h '+ date.getMinutes()
            if (lastDate.getDate() == date.getDate())
                break

            label += ' '+date.getDate()+'/'+literalMonth[ date.getMonth() ]

            if (lastDate.getFullYear() == date.getFullYear())
                break

            label += ' '+date.getFullYear()

            break

        case 'hour':
            label = date.getHours()+'h'
            if (lastDate.getDate() == date.getDate())
                break

            label += date.getDate()

            if (lastDate.getMonth() == date.getMonth())
                break

            label += '  '+literalMonth[ date.getMonth() ]

            if (date.getFullYear() == date.getFullYear())
                break

            label += ' '+date.getFullYear()

            break

        case 'day':
            label = date.getDate()

            if (lastDate.getMonth() == date.getMonth())
                break

            label += '  '+literalMonth[ date.getMonth() ]

            if (lastDate.getFullYear() == date.getFullYear())
                break

            label += ' '+date.getFullYear()

            break

        case 'month' :
            label = literalMonth[ date.getMonth() ]

            if (lastDate.getFullYear() == date.getFullYear())
                break

            label += ' '+date.getFullYear()

            break
    }

    return label
}

export const computeTimeLine = ( start, end, packBy, wishedIntervalle = 5 ) => {

    // degenerate cases handling
    if (end - start < 60)
        return []

    // determine the best intervalle between two note
    const width = end - start

    const delta = width / wishedIntervalle

    const best = availableIntervalles
        .map( x =>
            ( x < delta * 2 || delta < x * 2 ) * delta * 4 + Math.abs( x - delta ) )
        .reduce( (last, x, i) =>
            x < last.value ? {value:x, i:i} : last , {value: Infinity} )

    const intervalle = availableIntervalles[ best.i ]


    // determine the label ( hour, days ... )

    const unit = sortedDuration.reduce( (p, x) =>
        intervalle >= x.duration ? x : p )


    // determine the start date

    const startDate = new Date( start * 1000 )

    let first = new Date( startDate  )
    first.setSeconds( 0 )
    first.setMilliseconds( 1 )

    const mult = intervalle/ unit.duration

    switch( unit.label ) {
        case 'minutes':
            const mi = startDate.getMinutes()
            first.setMinutes( Math.ceil(mi / mult) * mult )

            break

        case 'hour':
            const h = startDate.getHours()
            first.setMinutes( 0 )
            first.setHours( Math.ceil(h / mult) * mult )

            break

        case 'day':
            const d = startDate.getDate()
            first.setMinutes( 0 )
            first.setHours( 0 )
            first.setDate( Math.ceil(d / mult) * mult )

            break

        case 'month' :

            let m = Math.floor( (startDate.getMonth()+1)  / mult ) * mult -1
            let y = first.getFullYear()
            first.setMinutes( 0 )
            first.setHours( 0 )

            first.setFullYear( y + (0|(m/12)) )
            first.setMonth(m%12)
            first.setDate( 1 )

            // TODO something is fucked here
            while( startDate.getTime()> first.getTime() ){

                m += mult

                first.setFullYear( y + (0|(m/12)) )
                first.setMonth(m%12)
                first.setDate( 1 )
            }

            break
    }



    // fill
    let milestones = []

    let last = new Date( 0 )
    let c = first

    while( c.getTime() < end*1000 ){

        // push
        milestones.push({

            // get a proper label
            label: labelDate( unit.label, c, last ),
            date: c.getTime() / 1000
        })

        // loop
        last = c

        switch( unit.label ) {
            case 'minutes':
            case 'hour':
            case 'day':
                c = new Date( c.getTime() + intervalle * 1000 )
                break

            case 'month':
                c = new Date( c.getTime() )
                let m = c.getMonth()+mult
                c.setFullYear( c.getFullYear() + (0|(m/12)) )
                c.setMonth( m%12 )
                break

            case 'year':
                c.setFullYear( c.getFullYear() +1 )
                break
        }

    }

    return {
        milestones: milestones,
        intervalle: intervalle
    }
}






































export const computeScale = ( maxY, wishedIntervalle = 3 ) => {

    // big one algo
    // one of the X number dsiplayed should be a round one

    const n = 0| Math.log( maxY )/Math.log( 10 )

    const primal = 0| ( maxY / Math.pow( 10, n ) )

    let bigOne = primal * Math.pow( 10, n )

    if ( primal < 2 ) {

        const second = (0| ( maxY / Math.pow( 10, n-1 ) )) % 10

        bigOne += second * Math.pow( 10, n-1 )
    }
    else if ( primal < 5 ) {

        let second = (0| ( maxY / Math.pow( 10, n-1 ) )) % 10

        second = ( 0| (second / 5 ) ) * 5

        bigOne += second * Math.pow( 10, n-1 )
    }

    return [
        {
            label: bigOne,
            y: bigOne / maxY,
            division: 0,
        },
        {
            label: 0,
            y: 0,
            division: 0,
        },
    ]
}
