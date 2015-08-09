import React, {Component, PropTypes} from "react"
import {renderFat, renderBasic} from "./curveBuilder.jsx"



export class Curve extends Component {


    static contextTypes = {
        graphDisturbedLinesStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            line: []
        }
    }

    componentWillMount(){

        this._update = () =>
            this.setState({
                line: this.context.graphDisturbedLinesStore.getLine( this.props.event ) })

        this.context.graphDisturbedLinesStore.on('change', this._update )

        this._update()
    }

    componentWillUnmount(){

        this.context.graphDisturbedLinesStore.removeListener('change', this._update )
    }

    componentWillReceiveProps( nextProps ){

        this.props= nextProps

        this._update()
    }

    render(){

        const line = this.state.line.map( p => ({
                x: p.x * this.props.width,
                y: p.y * this.props.height
            }) )

        switch ( this.props.type ) {
        case 'fat' :
            return renderFat( line, {color: this.props.color} )
        case 'basic' :
        default :
            return renderBasic( line, {color: this.props.color} )
        }
    }
}
