import { EventEmitter} from 'events'

import {resolve } from './handler'

export class Camera extends EventEmitter {

    constructor( context, dispatcher ){
        super()

        this.end = 0 | ( Date.now() / 1000 )
        this.start = 0| ( this.end - 3600 * 24 * 30 * 6 )

        this.packBy = 3600 * 24 * 7 * 1
        this.packOrigin = 0


        this.token = dispatcher.register( resolve.bind ( this ) )
    }

}
