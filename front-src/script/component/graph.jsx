import React, {Component, PropTypes} from "react"
import {FatLine} from "./fatLine.jsx"


const colors=[
    'purple',
    'yellow',
    'cyan',
]


const tremble = ( line, callback, options = {} ) => {

    const originalLine = line.slice()

    const duration = options.duration || 3000
    const mean = line.reduce( (sum, x) => sum + x, 0 ) / line.length
    const dispersion = mean * 0.03

    const params = line
        .map( x => ({
            x: x,
            w: 0.01 * ( Math.random() * 0.4 + 0.8 ),
            A:  ( x*0.08 + dispersion ) * ( Math.random() * 0.4 + 0.8 ) * 5,
            phy: Math.random() * Math.PI
        }) )

    let start = Date.now()
    let run = true
    const cycle = () => {

        if (!run)
            return

        const t = Date.now() - start

        if ( t> duration)
            return callback( params.map( o => o.x ) )

        const attenuation = Math.pow(1 - t/ duration, 3)

        const distordLine = params
            .map( o => o.x + Math.sin( o.phy + o.w * t ) * o.A * attenuation )

        callback( distordLine )

        requestAnimationFrame( cycle )
    }

    requestAnimationFrame( cycle )

    // cancel
    return () => run = false
}


export class Graph extends React.Component {

    static contextTypes = {
        transport: PropTypes.object,
        graphPreparer: PropTypes.object,
        camera: PropTypes.object,
    }

    constructor(){

        super()

        this.state = {
            points: {}
        }

        let cancelTremble = {}

        this._update = () => {

            const graphPreparer = this.context.graphPreparer
            const camera = this.context.camera

            const points = graphPreparer.computeDot()

            for( let i in cancelTremble )
                cancelTremble[ i ]()

            for( let i in points )
                cancelTremble[ i ] = tremble( points[i], line => {
                    let points = this.state.points || {}
                    points[ i ] = line
                    this.setState({points: points})
                })

            const maxY = Object.keys( points )
                .reduce( (max, x) => {
                    const maxLine = points[ x ].reduce( (max, y) =>
                        Math.max( max, y ), 0.5 )
                    return Math.max( max, maxLine )
                }, 0.5 )

            this.setState({
                start: camera.getIntervalle().start/ camera.getGrain(),
                end: camera.getIntervalle().end/ camera.getGrain(),
                maxY: maxY

            })

        }

    }

    componentWillMount(){

        const transport = this.context.transport
        const graphPreparer = this.context.graphPreparer

        graphPreparer.on('change', this._update)

        this._update()

        new Promise( resolve => setTimeout( resolve, 100 ) )

        .then( ::transport.getEvents )

        .then( res =>
            graphPreparer.points = res )

        .then( ::this._update  )
    }

    componentWillUnMount(){
        this.context.graphPreparer.removeListener('change', this._update)
    }

    render(){

        const points = this.state.points || {}

        const start = this.state.start
        const end = this.state.end
        const maxY = this.state.maxY

        const selected = this.state.selected || 0

        const viewport = {x: window.innerWidth, y: window.innerHeight}


        const lines = Object.keys( points )
            .map( x => {

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

                { lines[selected] && <FatLine line={ lines[selected] } /> }


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
