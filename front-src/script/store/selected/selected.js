import { EventEmitter} from 'events'

export class Selected extends EventEmitter {

    constructor(){
        super()

        this.selected = 'home-land'
    }

}
