import { EventEmitter} from 'events'
import { computeLine, troncate } from '../../util/graphPreparer'



const recomputeLines = function(){

    const pointsStore = this.stores.pointsStore
    const graphCameraStore = this.stores.graphCameraStore

    const events = pointsStore.getEvents()

    events
    .forEach( event =>
        this.computedLines[ event ] =
            troncate(
                computeLine(
                    pointsStore.getPoints( event ),
                    graphCameraStore.packBy,
                    graphCameraStore.packOrigin,
                    graphCameraStore.start,
                    graphCameraStore.end )
                ,
                0.05,
                0.95 )
    )

    const maxY = events
    .reduce( (max,event) => Math.max( max,
        this.computedLines[ event ].reduce( (max, p) => Math.max( max, p.y )  ,0)
        )
    ,1)

    events
    .forEach( event =>
        this.computedLines[ event ].forEach( p =>
            p.y =1- p.y/maxY )
    )

    graphCameraStore.maxY = maxY
    graphCameraStore.emit('change')


    this.emit('change')
}

const register = function(stores, dispatcher){
    this.token = dispatcher.register(  data => {

        switch( data.action ){
        case 'hydratePoint' :
            dispatcher.waitFor( [stores.pointsStore.token] )

            recomputeLines.call(this)
            break

        case 'translateGraphCamera' :
            dispatcher.waitFor( [stores.graphCameraStore.token] )

            recomputeLines.call(this)
            break
        }

    })
}

export class Lines extends EventEmitter {

    constructor(stores, dispatcher){
        super()

        this.computedLines = {}

        this.stores = stores

        register.call( this, stores, dispatcher )
    }

    getComputedLine( event ){
        return this.computedLines[ event ] || []
    }
}
