import { EventEmitter} from 'events'

export class Camera extends EventEmitter {

    constructor(){
        super()

        this.grain = 3600*24*7 * 1
    }

    getIntervalle(){
        return {
            start: Date.now()/1000 - 3600*24*30* 10,
            end: Date.now()/1000
        }
    }

    getVisibleEvents(){
        return [
            'home-land',
            'resume-land',
            'work-land',
        ]
    }

    getGrain(){

        return this.grain

        const n = 50
        const {start, end} = this.getIntervalle()

        return ( end - start ) / n
    }
}
