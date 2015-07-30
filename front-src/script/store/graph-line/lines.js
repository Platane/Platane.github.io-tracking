import { EventEmitter} from 'events'
import { computeLine } from '../../util/graphPreparer'



const recomputeLines = function(){

    const pointsStore = this.stores.pointsStore
    const graphCameraStore = this.stores.graphCameraStore

    const events = pointsStore.getEvents()

    events
    .forEach( event =>
        this.computedLines[ event ] = computeLine(
                pointsStore.getPoints( event ),
                graphCameraStore.packBy,
                graphCameraStore.start,
                graphCameraStore.end )
    )

    const maxY = events
    .reduce( (max,event) => Math.max( max,
        this.computedLines[ event ].reduce( (max,x) => Math.max( max, x )  ,0)
        )
    ,0)

    events
    .forEach( event =>
        this.computedLines[ event ] = this.computedLines[ event ]
        .map( (y,x) => ({
            x: x/this.computedLines[ event ].length,
            y: 1-y/maxY
        }) )
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

        case 'setGraphCamera' :
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
