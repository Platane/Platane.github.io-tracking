import React, {Component, PropTypes} from "react"
import {computeScale } from "../../../util/gridPreparer"


const lineStyle = {
    stroke: '#fff',
    fill: 'none',
    strokeWidth: 1,
    strokeLinecap : 'round'
}
const textStyle = {
    fill: '#fff',
    stroke: 'none',
    fontSize: 16,
    fontFamily: "helvetica"
}
export class VerticalAxe extends Component {


    static contextTypes = {
        graphCameraStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            scale: []
        }
    }

    componentWillMount(){

        const camera = this.context.graphCameraStore

        this._update = () => {

            this.setState({
                scales : computeScale(
                    camera.maxY
                ),
                packedBy: camera.packedBy
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
        this.props.height != nextProps.height && this._update()
    }

    render(){



        const scale = this.props.scale

        const marge = this.props.width * ( 1- scale ) * 0.5

        let textX = marge * 0.35
        if ( marge - textX < 60 )
            textX = Math.max( 0, marge - 60 )

        const scales = this.state.scales
            .map( o => ({

                label: o.label,
                y: ( 0.5 * (1-scale) + scale * ( 1-o.y ) ) *this.props.height

            })    )

        return (
            <g>
                { marge > 60 && scales.map( o =>
                    <line
                        y1={o.y}
                        y2={o.y}
                        x1={ textX + 45 }
                        x2={ Math.max( textX + 50,  marge * 0.8 ) }
                        style={lineStyle}/>
                )}
                {scales.map( o =>
                    <text
                        y={ o.y + 6 }
                        x={ textX }
                        style={textStyle}>{ o.label }</text>
                )}
            </g>
        )
    }
}
