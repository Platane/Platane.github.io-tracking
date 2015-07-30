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

    render(){

        const { width, height, selected } = this.props

        const innerWidth = width * 0.8
        const innerheight = height * 0.8

        const colorByEvent = events.reduce( (o, x, i) =>
            (o[ x ] = colorScheme[ i % colorScheme.length ]) && o, {})

        return (

            <div style={ {
                    ...GraphStyle,
                    width: width+'px',
                    height: height+'px',
                } }>

                <svg width={ width } height={ height }>

                    <Grid width={ width  } height={ height } />

                    <g transform={ `scale(0.8) translate(${ width*0.1 }, ${ height*0.1 })` }>

                    {events.map( x =>
                        x != selected && <Curve  key={x}
                                event={x}
                                color={colorByEvent[ x ]}
                                {...this.state}
                                width={width}
                                height={height}  />  )}

                    { selected && <Curve
                        type="fat"
                        event={selected}
                        color={colorByEvent[ selected ]}
                        {...this.state}
                        width={width}
                        height={height} />}

                    </g>

                </svg>

            </div>
        )
    }
}
