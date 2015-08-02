import React, {Component, PropTypes} from "react"
import {computeTimeLine } from "../../util/gridPreparer"


export class Grid extends Component {

    render(){
        return (
            <g>
                <HorizontalAxe {...this.props}/>
            </g>
        )
    }
}



const lineStyle = {
    stroke: '#333',
    opacity: '0.5',
    fill: 'none',
    strokeWidth: 0.5
}
const textStyle = {
    fill: '#fff',
    stroke: 'none',
    fontSize: 12,
    fontFamily: "Verdana"
}
class HorizontalAxe extends Component {


    static contextTypes = {
        graphCameraStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            timeLine: {}
        }
    }

    componentWillMount(){

        const camera = this.context.graphCameraStore

        this._update = () => {

            let l = computeTimeLine(
                    camera.start,
                    camera.end,
                    camera.packBy,
                    this.props.width/ 180 )
            if(!l || !l.length)
                debugger

            if ( l.filter( x => x.date < camera.start || x.date > camera.end).length )
                debugger

            this.setState({
                timeLine : computeTimeLine(
                    camera.start,
                    camera.end,
                    camera.packBy,
                    this.props.width/ 180 ),
                start: camera.start,
                end: camera.end,
                })
        }

        camera.on('change', this._update )

        this._update()
    }

    componentWillUnmount(){

        const camera = this.context.graphCameraStore

        camera.removeListener('change', this._update )
    }

    render(){



        const scale = this.props.scale

        const top = this.props.height * (1-scale) * 0.5
        const bot = this.props.height - top
        const marge = top

        const start = this.state.start
        const end = this.state.end


        if ( !this.state.timeLine.length )
            debugger

        if ( this.state.timeLine.filter( x => x.date < start || x.date > end).length )
            debugger

        const timeLine = this.state.timeLine
            .map( x => ({

                label: x.label,
                x: ( 0.5 * (1-scale) + scale * (x.date - start)/(end - start) )*this.props.width,

            })    )

        return (
            <g>
                {timeLine.map( x =>
                    <line
                        y1={top}
                        y2={bot}
                        x1={ x.x }
                        x2={ x.x }
                        style={lineStyle}/>
                )}
                {timeLine.map( x =>
                    <text
                        y={ bot +marge *0.5 }
                        x={ x.x - 10 }
                        transform={`rotate(35 ${x.x + 10} ${bot +marge/2})`}
                        style={textStyle}>{ x.label }</text>
                )}
            </g>
        )
    }
}
