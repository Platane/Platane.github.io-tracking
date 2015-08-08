
export const troncate = ( points, start, end ) => {

    if ( !points.length )
        return points

    if ( points.length == 1 )
        return [{
            x: Math.min( Math.max( points[ 0 ].x, start ), end ),
            y: points[ 0 ].y
        }]

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

export const computeLine = ( points, packBy, packOrigin, start, end ) => {

    // round the born to the closer packOrigin
    const _start = Math.floor( (start-packOrigin) / packBy) * packBy + packOrigin
    const _end = Math.ceil( (end-packOrigin) / packBy) * packBy + packOrigin

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
    output = output
    .map( (x, i) =>
        ({
            x: ( _start + ( i * packBy ) - start )/( end - start ),
            y: x
        })  )

    // cut the outside points
    troncate( output, 0, 1)

    return output
}
