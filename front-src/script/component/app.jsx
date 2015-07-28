import React, {Component, PropTypes} from "react"
import { Graph } from './graph.jsx'

export class App extends Component {

    static childContextTypes = {
        transport: PropTypes.object,
        graphPreparer: PropTypes.object,
        camera: PropTypes.object,
    }

    componentWillMount(){

    }

    getChildContext() {
        return {
            transport: this.props.transport,
            graphPreparer: this.props.graphPreparer,
            camera: this.props.camera,
        }
    }

    render(){
        return (

            <Graph/>

        )
    }
}
