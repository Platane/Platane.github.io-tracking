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
}
