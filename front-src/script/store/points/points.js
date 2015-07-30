import { EventEmitter} from 'events'

const register = function(stores, dispatcher){
    this.token = dispatcher.register(  data => {

        switch( data.action ){
        case 'hydratePoint' :

            this.points = data.points
            break
        }
    })
}

export class Points extends EventEmitter {

    constructor(stores, dispatcher){
        super()

        this.points = {}

        register.call( this, stores, dispatcher )
    }

    getEvents( event ){
        return Object.keys( this.points )
    }

    getPoints( event ){
        return this.points[ event ] || []
    }
}
