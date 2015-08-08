export class Action{

    constructor( context, dispatcher ){
        this.dispatcher = dispatcher
    }

    hydratePoint( points ){
        this.dispatcher.dispatch({
            action: 'hydratePoint',
            points: points
        })
    }


    startMovingGraphCamera(){
        this.dispatcher.dispatch({
            action: 'startMovingGraphCamera',
        })
    }
    endMovingGraphCamera(){
        this.dispatcher.dispatch({
            action: 'endMovingGraphCamera',
        })
    }
    translateGraphCamera( newStart ){
        this.dispatcher.dispatch({
            action: 'translateGraphCamera',
            newStart : newStart
        })
    }
}
