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
            selected: null,

            width:0,
            height:0,
        }
    }

    componentWillMount(){

        this._update = () =>
            this.setState({ selected: this.props.selectedStore.selected })

        this.props.selectedStore.on('change', this._update )

        this._update()



        this._updateSize = () =>
            this.setState({ width: window.innerWidth, height: window.innerHeight })

        window.addEventListener('resize', this._updateSize)
        this._updateSize()
    }

    componentWillUnmount(){

        this.props.selectedStore.off('change', this._update )

        window.removeEventListener('resize', this._updateSize)
    }

    getChildContext() {
        let ctx = {}
        for ( let i in App.childContextTypes )
            ctx[i] = this.props[i]
        return ctx
    }

    render(){
        return (

            <Graph {...this.state}/>

        )
    }
}
