import React, {Component, PropTypes} from "react"
import { Graph } from './graph/graph.jsx'
import { Literal } from './literal/literal.jsx'


const rootStyle = {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
}
const footerStyle = {
    fontFamily: 'helvetica',
    position: 'absolute',
    right: '10px',
    bottom: '0',
}

export class App extends Component {

    static childContextTypes = {
        action: PropTypes.object,

        pointsStore: PropTypes.object,
        selectedStore: PropTypes.object,


        graphCameraStore: PropTypes.object,
        graphLinesStore: PropTypes.object,
        graphDisturbedLinesStore: PropTypes.object,

        literalSum: PropTypes.object,
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


        // layout
        const {width, height} = this.state

        let graph = {}
        let literal = {}
        let layout

        if ( width > 1.5 * height ) {
            layout = 'row'
            literal.width = Math.min( 300, width * 0.3 )
            graph.width = width - literal.width

            literal.height = graph.height = height

        } else {
            layout = 'column'
            literal.height = Math.min( 300, height * 0.3 )
            graph.height = height - literal.height

            literal.width = graph.width = width
        }


        return (
            <div style= { {...rootStyle, flexDirection: layout } }>
                <Graph selected = {this.state.selected} {...graph}/>

                <Literal layout = {layout} />

                <footer style={ footerStyle }>

                    metrics for <a href="//platane.me">platane.me</a>

                    &nbsp;&nbsp;

                    <a href="//github.com/Platane/Platane.github.io-tracking">GitHub</a>
                </footer>
            </div>
        )
    }
}
