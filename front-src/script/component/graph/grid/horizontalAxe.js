import React, {Component, PropTypes} from "react"
import {computeTimeLine } from "../../../util/gridPreparer"


const lineStyle = {
    stroke: '#333',
    opacity: '0',
    fill: 'none',
    strokeWidth: 0.5
}
const bandStyle = {
    fill: 'rgba(0,0,0, 0.075)',
    stroke: 'none',
}
const textStyle = {
    fill: '#fff',
    stroke: 'none',
    fontSize: 16,
    fontFamily: "helvetica"
}
export class HorizontalAxe extends Component {


    static contextTypes = {
        graphCameraStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            timeLine: []
        }
    }

    componentWillMount(){

        const camera = this.context.graphCameraStore

        this._update = () => {

            this.setState({
                ...computeTimeLine(
                    camera.start,
                    camera.end,
                    camera.packBy,
                    this.props.width/ 200 ),
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

    componentWillReceiveProps( nextProps ){
        this.props.width != nextProps.width && this._update()
    }

    render(){



        const scale = this.props.scale

        let top = this.props.height * (1-scale) * 0.5
        let bot = this.props.height - top
        const marge = top

        top-= 20
        bot+= 20

        const start = this.state.start
        const end = this.state.end

        const intervalle = this.state.intervalle
        const onScreenDelta = intervalle / (end - start) * this.props.width * scale

        const proj = x =>
            ( 0.5 * (1-scale) + scale * (x - start)/(end - start) )*this.props.width

        const milestones = this.state.milestones
            .map( x => ({

                label: x.label,
                x: proj( x.date )
            })    )

        const bars = this.state.milestones
            .concat( [
                {date: this.state.milestones.slice(-1)[0].date + intervalle },
                {date: this.state.milestones.slice( 0)[0].date - intervalle },
                {date: this.state.milestones.slice( 0)[0].date - 2*intervalle },
                {date: this.state.milestones.slice(-1)[0].date + 2*intervalle },
             ] )
            .filter( x =>
                ( 0 | ( x.date / intervalle ) ) % 2 )
            .map( o => {

                const margeWidth = this.props.width * (1-scale) * 0.5

                // position of the band which cross the graph limit when the fading start
                const po = 0.2

                let outside = 0

                if ( o.date - intervalle * (1-po) < start )
                    outside = start - ( o.date - intervalle * (1-po) )

                if ( o.date - intervalle * po > end )
                    outside = ( o.date - intervalle * po ) - end


                outside = outside / (end - start)

                return {
                    x: proj( o.date ),
                    o: Math.max(0, 1-outside * 10 )
                }
            })


        return (
            <g>

                {bars
                    .map( (o, i) =>
                        <rect
                            key={i}
                            y={top}
                            x={ o.x - onScreenDelta }
                            width={ onScreenDelta }
                            height={ bot-top }
                            style={ {...bandStyle, opacity:o.o} }/>
                    )
                }

                {milestones.map( (x, i) =>
                    <text
                        key={i}
                        y={ bot +marge *0.5 }
                        x={ x.x - 10 }
                        transform={`rotate(35 ${x.x + 10} ${bot +marge/2})`}
                        style={textStyle}>{ x.label }</text>
                )}
            </g>
        )
    }
}
