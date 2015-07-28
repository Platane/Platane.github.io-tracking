import React, {Component, PropTypes} from "react"


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

        const viewport = {x: 500, y:500}

        return (
            <svg xmlns="http://www.w3.org/svg/2000" width={viewport.x} height={viewport.x}>

                {Object.keys( points ).map( (x, i) =>
                    <Curve  key={x}
                            label={ x }
                            points={ points[x] }
                            start={ start }
                            end={ end }
                            viewport={ viewport }
                            color={ colors[i%colors.length] } />
                )}

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
