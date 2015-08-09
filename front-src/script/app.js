import { App } from './component/app.jsx'
import { Dispatcher } from 'flux'
import * as React from 'react'


let dispatcher = new Dispatcher()


let context = {}
context.pointsStore                     = new (require('./store/points/points').Points  )( context, dispatcher )
context.selectedStore                   = new (require('./store/selected/selected').Selected  )( context, dispatcher )

context.graphCameraStore                = new (require('./store/graph-camera/camera').Camera  )( context, dispatcher )
context.graphLinesStore                 = new (require('./store/graph-line/lines').Lines  )( context, dispatcher )
context.graphDisturbedLinesStore        = new (require('./store/graph-disturbed-line/lines').Lines  )( context, dispatcher )
context.graphMotionStore                = new (require('./store/graph-motion/motion').Motion  )( context, dispatcher )
context.literalSum                      = new (require('./store/literal-sum/sum').Sum  )( context, dispatcher )

import { Action as Action  } from './action/action'

context.action = new Action( context, dispatcher )


window.addEventListener('load', () =>
    React.render( React.createElement( App, context, null ), document.body )  )




import { Transport } from './transport'

let transport = new Transport

new Promise( resolve => setTimeout( resolve, 200 ) )

.then( ::transport.getEvents )

.then( ::context.action.hydratePoint )
