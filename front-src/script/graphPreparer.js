import { EventEmitter} from 'events'

const computeDot = ( camera, points ) => {

    const grain = camera.getGrain()
    const { start, end } = camera.getIntervalle()


    const n = Math.ceil(  ( end - start ) / grain )

    let output = Array.apply(null, Array( n ))
        .map( _ => 0)

    points
    .filter( x =>
        x >= start && x < end )
    .forEach( x =>
        output[  Math.floor( ( x - start )/ grain )  ] ++  )


    return output
}

const computeAllVisibles = ( camera, points ) => {
    let output = {}

    camera.getVisibleEvents()
    .forEach( x =>
        output[x] = computeDot( camera, points[x] || [] ) )

    return output
}

export class GraphPreparer extends EventEmitter {

    constructor( context ){
        super()

        this.context = context
    }

    computeDot( ){

        const camera = this.context.camera
        const points = this.points || []

        return computeAllVisibles( camera, points )
    }

}
