
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
    if ( output.length > 1 )

        [
            [0 ,1, 0 ],
            [output.length-1, output.length-2, 1 ],

        ].forEach( x => {

            let a = output[ x[0] ]
            let b = output[ x[1] ]

            const t = (a.x - x[2])/(a.x - b.x)
            a.y = t * b.y + (1-t) * a.y
            a.x = x[2]
        })

    return output
}
