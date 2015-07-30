import React, {Component, PropTypes} from 'react'

import {Grid} from './grid.jsx'
import {Curve} from './curve.jsx'


const GraphStyle = {
    border: 'solid 2px #333',
}
const events =  [
    'home-land',
    'resume-land',
    'work-land',
]
const colorScheme = [
    'purple',
    'cyan',
    'yellow',
]

export class Graph extends Component {

    render(){

        const { width, height, selected } = this.props

        return (

            <div style={ {
                    ...GraphStyle,
                    width: width+'px',
                    height: height+'px'
                } }>

                <svg width={ width } height={ height }>

                    <Grid width={ width } height={ height } />

                    {events.map( x =>
                        x != selected && <Curve  key={x}
                                event={x}
                                {...this.state}
                                width={width}
                                height={height}  />  )}

                    { selected && <Curve type="fat" {...this.state} width={width} height={height} event={selected}  />}

                </svg>

            </div>
        )
    }
}
