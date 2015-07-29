import { EventEmitter} from 'events'

export class Camera extends EventEmitter {

    constructor(){
        super()

        this.end = Date.now() / 1000
        this.start = this.end - 3600 * 24 * 30 * 10
        this.packBy = 3600 * 24 * 7 * 3
    }

}
