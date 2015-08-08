import { App } from './component/app.jsx'
import { Dispatcher } from 'flux'
import * as React from 'react'


import { Camera as GraphCameraStore } from './store/graph-camera/camera'
import { Lines as GraphLinesStore  } from './store/graph-line/lines'
import { Points as PointsStore  } from './store/points/points'
import { Selected as SelectedStore  } from './store/selected/selected'

let dispatcher = new Dispatcher()
let context = {}
context.graphCameraStore  = new GraphCameraStore( context, dispatcher )
context.graphLinesStore  = new GraphLinesStore( context, dispatcher )
context.pointsStore  = new PointsStore( context, dispatcher )
context.selectedStore = new SelectedStore( context, dispatcher )

import { Action as Action  } from './action/action'

context.action = new Action( context, dispatcher )


window.addEventListener('load', () =>
    React.render( React.createElement( App, context, null ), document.body )  )




import { Transport } from './transport'

let transport = new Transport

new Promise( resolve => setTimeout( resolve, 200 ) )

.then( ::transport.getEvents )

.then( ::context.action.hydratePoint )
