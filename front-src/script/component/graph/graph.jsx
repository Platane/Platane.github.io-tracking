import React, {Component, PropTypes} from 'react'

import {Grid} from './grid.jsx'
import {Curve} from './curve.jsx'


const GraphStyle = {
    // border: 'solid 2px #333',
    backgroundColor: '#d88'
}
const events =  [
    'home-land',
    'resume-land',
    'work-land',
]
const colorScheme = [
    'white',
    'cyan',
    'yellow',
]

export class Graph extends Component {

    static contextTypes = {
        graphCameraStore: PropTypes.object,
        action: PropTypes.object,
    }

    mouseDown( event ){
        this._originX = event.pageX
        this._dragging = true
        this._originStart = this.context.graphCameraStore.start

        const timeWidth = this.context.graphCameraStore.end - this.context.graphCameraStore.start

        this._ratio = timeWidth / this.props.width

        this.context.action.startMovingGraphCamera()
    }
    mouseMove( event ){

        if (!this._dragging)
            return

        const newStart = ( this._originX - event.pageX ) * this._ratio + this._originStart

        this.context.action.translateGraphCamera( newStart )
    }
    mouseUp( event ){
        this._dragging = false
        this.context.action.endMovingGraphCamera()
    }

    render(){

        const { width, height, selected } = this.props

        const scale = 0.7

        const innerWidth = width * scale
        const innerheight = height * scale

        const colorByEvent = events.reduce( (o, x, i) =>
            (o[ x ] = colorScheme[ i % colorScheme.length ]) && o, {})

        return (

            <div    style={ {
                        ...GraphStyle,
                        width: width+'px',
                        height: height+'px',
                    } }

                    onMouseDown = { event => this.mouseDown(event) }
                    onMouseMove = { event => this.mouseMove(event) }
                    onMouseUp = { event => this.mouseUp(event) }
                >

                <svg width={ width } height={ height }>

                    <Grid width={ width  } height={ height } scale={ scale }/>

                    <g transform={ `translate(${ width*(1-scale)*0.5 }, ${ height*(1-scale)*0.5 }) scale(${scale})` }>

                    {events.map( x =>
                        x != selected && <Curve  key={x}
                                event={x}
                                color={colorByEvent[ x ]}
                                width={width}
                                height={height}  />  )}

                    { selected && <Curve
                        type="fat"
                        event={selected}
                        color={colorByEvent[ selected ]}
                        width={width}
                        height={height} />}

                    </g>

                </svg>

            </div>
        )
    }
}
