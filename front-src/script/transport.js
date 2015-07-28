import { EventEmitter} from 'events'




export class Transport extends EventEmitter {

    constructor(){
        super()
    }

    getEvents(){
        return fetch('./events')
        .then( res => {
            if (res.status !== 200)
                return Promise.resolve( 'response status is not 200' )

            return res.json()
        })
    }

}
