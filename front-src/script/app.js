import { App } from './component/app.jsx'
import * as React from 'react'


import { GraphPreparer } from './graphPreparer'
import { Camera } from './camera'
import { Transport } from './transport'

let context = {}
context.graphPreparer = new GraphPreparer( context )
context.camera = new Camera( context )
context.transport = new Transport( context )



window.addEventListener('load', () =>
    React.render( React.createElement( App, context, null ), document.body )  )
