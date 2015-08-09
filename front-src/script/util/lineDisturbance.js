export const tremble = ( line, callback, options = {} ) => {

    const originalLine = line.slice()

    const duration = options.duration || 3000
    const mean = line.reduce( (sum, p) => sum + p.y, 0 ) / line.length
    const dispersion = mean * 0.03

    const params = line
        .map( p => ({
            p: p,
            w: 0.01 * ( Math.random() * 0.4 + 0.8 ),
            A:  ( p.y*0.08 + dispersion ) * ( Math.random() * 0.4 + 0.8 ),
            phy: Math.random() * Math.PI
        }) )

    let start = Date.now()
    let run = true
    const cycle = () => {

        if (!run)
            return

        const t = Date.now() - start

        if ( t> duration)
            return callback( params.map( o => o.p ) )

        const attenuation = Math.pow(1 - t/ duration, 3)

        const distordLine = params
            .map( o => ({
                x: o.p.x,
                y: o.p.y + Math.sin( o.phy + o.w * t ) * o.A * attenuation })  )

        callback( distordLine )

        requestAnimationFrame( cycle )
    }

    requestAnimationFrame( cycle )

    // cancel
    return () => run = false
}

export const interpolateThenTremble = ( lineA, lineB, callback, options = {} ) => {

    return tremble( lineB, callback, options )
}
