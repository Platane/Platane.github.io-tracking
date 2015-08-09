import { EventEmitter} from 'events'


/**
 * deterministic way to generate params
 *
 */
const param = (x, start, end) => {
    const inv = x * ( end - start ) + start
    return {
        A: 0.02,
        phy: Math.sin( inv * 34 ) * Math.PI  ,
        w: 0.16 + Math.sin( inv * 17 ) * 0.05
    }
}

const startDisturb = function( ){
    if (this.run)
        return

    const motionStore = this.stores.graphMotionStore
    const cameraStore = this.stores.graphCameraStore
    const linesStore = this.stores.graphLinesStore
    const pointsStore = this.stores.pointsStore


    const update = () => {

        const disturbance = motionStore.disturbance

        this.t ++

        pointsStore.getEvents().forEach( event =>
            this.lines[ event ] = linesStore.getLine( event ).map( p => {

                const par = param( p.x, cameraStore.start, cameraStore.end )

                const d = Math.sin( par.phy + par.w * this.t ) * Math.min( 1.5, disturbance * disturbance * 150 )

                return {
                    x: p.x,
                    y: 1 - (1-p.y) * ( 0.9 + d* 0.2 ) + d * par.A,
                }
            } )
        )


        this.emit('change')

        if ( disturbance < 0.00001 )
            this.run = false

        if ( this.run )
            requestAnimationFrame( update )
    }

     this.run = true
     update()
}

const stopDisturb = function( event ){
    this.run = false
}

const register = function(stores, dispatcher){
    this.token = dispatcher.register(  data => {

        switch( data.action ){

        case 'startMovingGraphCamera' :
        case 'translateGraphCamera' :
            dispatcher.waitFor( [stores.graphMotionStore.token] )

            startDisturb.call(this)
            break

        case 'hydratePoint' :
            dispatcher.waitFor( [stores.graphLinesStore.token] )

            startDisturb.call(this)
            break
        }

    })
}

export class Lines extends EventEmitter {

    constructor(stores, dispatcher){
        super()

        this.lines = {}
        this.t = 0

        this.stores = stores

        register.call( this, stores, dispatcher )
    }

    getLine( event ){
        return this.lines[ event ] || []
    }
}
