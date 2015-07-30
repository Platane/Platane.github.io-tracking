import React, {Component, PropTypes} from "react"

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

const renderFat = ( points, options = {} ) => {

}
const renderBasic = ( points, options = {} ) =>
    <polyline
        points={ points.reduce( (path,p) => path+p.x+','+p.y+' ', '') }
        style={ {
            fill: 'none',
            stroke: options.color || '#555',
            strokeWidth: options.tickness || 1,
            strokeLinecap: 'round' } } />

export class Curve extends Component {


    static contextTypes = {
        graphLinesStore: PropTypes.object,
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
        case 'basic' :
        default :
            return renderBasic( this.state.line )
        }
    }
}
