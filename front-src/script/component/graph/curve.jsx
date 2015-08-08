import React, {Component, PropTypes} from "react"
import {renderFat, renderBasic} from "./curveBuilder.jsx"

const computeLine = function( ){

    const { event, width, height } = this.props
    const { graphLinesStore } = this.context

    const line = graphLinesStore
        .getComputedLine( event )
        .map( p => ({
            x: p.x * width,
            y: p.y * height
        })  )

    this.setState({line: line})
}


export class Curve extends Component {


    static contextTypes = {
        graphLinesStore: PropTypes.object,
        graphCameraStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            line: []
        }
    }

    componentWillMount(){

        this._update = () =>
            computeLine.call( this )

        this.context.graphLinesStore.on('change', this._update )

        computeLine.call( this )
    }

    componentWillUnmount(){

        this.context.graphLinesStore.removeListener('change', this._update )
    }

    componentWillReceiveProps( nextProps ){

        this.props= nextProps

        computeLine.call( this )
    }

    render(){
        switch ( this.props.type ) {
        case 'fat' :
            return renderFat( this.state.line, {color: this.props.color} )
        case 'basic' :
        default :
            return renderBasic( this.state.line, {color: this.props.color} )
        }
    }
}
