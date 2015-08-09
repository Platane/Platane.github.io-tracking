import { EventEmitter} from 'events'

class PreviousStack {

    constructor( n = 15 ){

        this.n = n

        this.q = Array.apply(null, Array( this.n ))
            .map( () => 0 )

        this.coeff = this.q
            .map( (_, i) =>
                i && (2 * (n-i) )/( (n-1)*(n-1) )   )
    }

    push( s ){
        this.q.unshift( s )
        this.q.splice( this.n, Infinity )

        return this
    }

    disturbance( ){
        const absoluteDeltaSum =this.q
            .reduce( (s, x, i) =>
                i && s +   ( Math.abs( this.q[i-1] - x ) * this.coeff[ i ] )    ,0 )

        // const signedDeltaSum =this.q
        //     .reduce( (s, x, i) =>
        //         i && s +   this.q[i-1] - x   ,0 )
        //
        // return ( signedDeltaSum>=0 ? absoluteDeltaSum : - absoluteDeltaSum ) / this.n

        return absoluteDeltaSum
    }

    reset( s ){
        this.q = this.q.map( () => s )

        return this
    }
}

const startReading = function(){

    const cameraStore = this.stores.graphCameraStore
    const stack = this.stack = this.stack || new PreviousStack().reset( cameraStore.start )


    clearTimeout( this._timeout )

    const cycle = () => {

        stack.push( cameraStore.start )

        const d =  stack.disturbance()

        if ( d != this.disturbance) {
            this.disturbance = d / ( cameraStore.end - cameraStore.start )
            this.emit('change')
        }

        this._timeout = setTimeout( cycle, 100 )
    }

    cycle()
}

const stopReading = function(){

    const cameraStore = this.stores.graphCameraStore
    const stack = this.stack

    clearTimeout( this._timeout )

    const cycle = () => {

        stack.push( cameraStore.start )

        const d =  stack.disturbance()

        if ( d != this.disturbance) {
            this.disturbance = d / ( cameraStore.end - cameraStore.start )
            this.emit('change')
        }

        if ( d > 0.00001 )
            this._timeout = setTimeout( cycle, 100 )
    }

    cycle()
}

const register = function(stores, dispatcher){


    this.token = dispatcher.register(  data => {


        switch( data.action ){
        case 'translateGraphCamera' :
            dispatcher.waitFor( [stores.graphCameraStore.token] )
            break

        case 'startMovingGraphCamera' :
            dispatcher.waitFor( [stores.graphCameraStore.token] )

            startReading.call( this )
            break

        case 'endMovingGraphCamera' :
            dispatcher.waitFor( [stores.graphCameraStore.token] )

            stopReading.call( this )
            break
        }

    })
}

export class Motion extends EventEmitter {

    constructor(stores, dispatcher){
        super()

        this.disturbance = 0

        this.stores = stores

        register.call( this, stores, dispatcher )
    }
}
