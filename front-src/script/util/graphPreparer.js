
export const troncate = ( points, start, end ) => {

    if ( !points.length )
        return points

    if ( points[0].x > end || points[ points.length-1 ].x < start  )
        return ( points.length = 0 , points )

    if ( points.length == 1 )
        return points.splice(0,Infinity,{
            x: Math.min( Math.max( points[ 0 ].x, start ), end ),
            y: points[ 0 ].y
        })

    ;[
        [start, 1 ],
        [end, -1 ],

    ].forEach( x => {

        let [ limit, v ] = x

        let s =  v == 1 ? 0 : points.length-1
        while( ( v == 1 ) == ( points[ s ].x < limit ) )
            s += v


        let ia = s-v
        let ib = s

        let a = points[ ia ]
        let b = points[ ib ]

        if ( !a || !b )
            return

        v == -1 ? points.splice( ia+1, Infinity ) : points.splice( 0, ia )

        const t = (a.x - limit)/(a.x - b.x)
        a.y = t * b.y + (1-t) * a.y
        a.x = limit
    })

    return points
}

export const computeLine = ( points, packBy, packOrigin, start, end, cutDate ) => {

    // round the born to the closer packOrigin
    const _start = ( Math.floor( (start-packOrigin) / packBy) - 1 ) * packBy + packOrigin
    const _end = ( Math.ceil( (end-packOrigin) / packBy) + 1 ) * packBy + packOrigin

    const n = Math.floor(  ( _end - _start ) / packBy ) +1

    let output = Array.apply(null, Array( n ))
        .map( _ => 0)


    // count all the events in each intervals
    points
    .filter( x =>
        x >= _start && x < _end + packBy )
    .forEach( x =>
        output[  Math.floor( ( x - _start )/ packBy )  ] ++  )

    // transform in points
    // x in [ 0, 1 ]
    // y in |[ 0, Infinity |[
    let tmp
    output = output
    .map( (x, i) =>
        ({
            date: tmp = _start + ( (i + 0.5) * packBy ),  // the intervalle is [ date, date + packBy [

            x: ( tmp - start )/( end - start ),
            y: x,
        })  )


    //// cut after the cut
    // ( there is no point after the cut )

    // locate the cut
    let i = output.length
    while ( i-- && output[i].date - packBy * 0.5 > cutDate )
        ;

    if ( i>=0 && i < output.length ) {

        output.splice( i+1, Infinity )

        // so ..
        // output[i].date - packBy * 0.5 < cutDate < output[i].date + packBy * 0.5

        output[i].date = cutDate
        output[i].x = ( cutDate - start )/( end - start )

    }



    // cut the outside points
    troncate( output, 0, 1)

    return output
}
