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

    }

    getChildContext() {
        let ctx = {}
        for ( let i in App.childContextTypes )
            ctx[i] = this.props[i]
        return ctx
    }

    render(){
        return (

            <Graph width={500} height={500}/>

        )
    }
}
