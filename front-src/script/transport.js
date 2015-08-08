import { EventEmitter} from 'events'


const endPoint = 'https://platane-me-dynamic-content.herokuapp.com/'

export class Transport extends EventEmitter {

    constructor(){
        super()
    }

    getEvents(){
        return fetch( endPoint+'./events' )
        .then( res => {
            if (res.status !== 200)
                return Promise.resolve( 'response status is not 200' )

            return res.json()
        })
    }

}
