import React, {Component, PropTypes} from "react"
import {FatLine} from "./fatLine.jsx"


console.log( FatLine )

const colors=[
    'purple',
    'yellow',
    'cyan',
]

export class Graph extends React.Component {

    static contextTypes = {
        transport: PropTypes.object,
        graphPreparer: PropTypes.object,
        camera: PropTypes.object,
    }

    constructor(){

        super()

        this.state = {}

        this._update = () =>
            this.setState({
                points: this.context.graphPreparer.computeDot(),
                start: this.context.camera.getIntervalle().start/ this.context.camera.getGrain(),
                end: this.context.camera.getIntervalle().end/ this.context.camera.getGrain(),
            })
    }

    componentWillMount(){

        const transport = this.context.transport
        const graphPreparer = this.context.graphPreparer

        graphPreparer.on('change', this._update)

        this._update()



        transport.getEvents()

        .then( res =>
            graphPreparer.points = res )

        .then( ::this._update  )
    }

    componentWillUnMount(){
        this.context.graphPreparer.removeListener('change', this._update)
    }

    render(){

        const points = this.state.points

        const start = this.state.start
        const end = this.state.end

        const selected = this.state.selected || 0

        const viewport = {x: window.innerWidth, y: window.innerHeight}


        const lines = Object.keys( points )
            .map( x => {

                const maxY = points[ x ].reduce( (max, y) =>
                    Math.max( max, y ), 0.5 )

                return points[ x ]
                    .map( (y, x) =>
                        ({
                            x: ( x/(end-start) * 0.7 + 0.15 )  *viewport.x,
                            y: ( 1 - y/maxY * 0.7 - 0.15 )  *viewport.y
                        })
                    )
            })


                    // <Curve  key={x}
                    //         label={ x }
                    //         points={ points[x] }
                    //         start={ start }
                    //         end={ end }
                    //         viewport={ viewport }
                    //         color={ colors[i%colors.length] } />
        return (
            <svg xmlns="http://www.w3.org/svg/2000" width={viewport.x} height={viewport.y} style={ {background: '#d88'} }>

                {Object.keys( points )
                    .map( (x, i) =>
                        i != selected && <polyline  points={ lines[i].reduce( (path, p) => path + p.x +','+ p.y+ ' ', '' ) } style={ {fill: 'none', stroke:colors[i], strokeLinecap: 'round', strokeWidth: 0.6} } />

                )}

                <FatLine line={ lines[selected] } />


            </svg>
        )
    }
}



class Curve extends React.Component {

    render(){

        const label = this.props.label
        const points = this.props.points

        const start = this.props.start
        const end = this.props.end

        const viewport = this.props.viewport

        const maxY = points.reduce( (max, y) =>
            Math.max( max, y ), 0.5 )

        const path = points
            .map( (y, x) =>
                ({
                    x: x/(end-start)  *viewport.x,
                    y: ( 1 - y/maxY * 0.9 )  *viewport.y
                })
            )

            .reduce( (path, p, i) =>
                path + ( i==0 ? 'M' : 'L' ) + p.x +' '+ p.y+ ' ', '' )



        return (
            <g className={ 'curve curve-'+label }>

                <path d={path}  style={ {fill: 'none', stroke: this.props.color}  }/>

            </g>
        )
    }

}
