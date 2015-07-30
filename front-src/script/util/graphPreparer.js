
export const computeLine = ( points, packBy, start, end ) => {

    const n = Math.ceil(  ( end - start ) / packBy )

    let output = Array.apply(null, Array( n ))
        .map( _ => 0)

    points
    .filter( x =>
        x >= start && x < end )
    .forEach( x =>
        output[  Math.floor( ( x - start )/ packBy )  ] ++  )

    return output
}
