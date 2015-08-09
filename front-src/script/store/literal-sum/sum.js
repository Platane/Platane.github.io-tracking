import { EventEmitter} from 'events'

const computeSum = function(){

    const { start, end } = this.stores.graphCameraStore
    const pointsStore = this.stores.pointsStore

    this.sum = {}

    pointsStore.getEvents()
    .forEach( event => {

        this.sum[ event ] = pointsStore.getPoints( event )
            .filter( date => date >= start && date < end )
            .length

    })

    this.emit('change')
}


const register = function(stores, dispatcher){


    this.token = dispatcher.register(  data => {


        switch( data.action ){
        case 'hydratePoint' :
        case 'translateGraphCamera' :
            dispatcher.waitFor( [stores.graphCameraStore.token] )

            computeSum.call( this )
            break
        }

    })
}

export class Sum extends EventEmitter {

    constructor(stores, dispatcher){
        super()

        this.sum = {}

        this.stores = stores

        register.call( this, stores, dispatcher )
    }

    getSum( event ){
        return this.sum[ event ] || 0
    }
}
