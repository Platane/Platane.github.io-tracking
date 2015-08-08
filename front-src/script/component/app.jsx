import React, {Component, PropTypes} from "react"
import { Graph } from './graph/graph.jsx'

export class App extends Component {

    static childContextTypes = {
        action: PropTypes.object,
        graphLinesStore: PropTypes.object,
        graphCameraStore: PropTypes.object,
        pointsStore: PropTypes.object,
        selectedStore: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            selected: null
        }
    }

    componentWillMount(){

        this._update = () =>
            this.setState({ selected: this.props.selectedStore.selected })

        this.props.selectedStore.on('change', this._update )

        this._update()
    }

    componentWillUnmount(){

        this.props.selectedStore.off('change', this._update )
    }

    getChildContext() {
        let ctx = {}
        for ( let i in App.childContextTypes )
            ctx[i] = this.props[i]
        return ctx
    }

    render(){
        return (

            <Graph selected={this.state.selected} width={1100} height={800}/>

        )
    }
}
