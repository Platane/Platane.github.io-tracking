import React, {Component, PropTypes} from "react"

export class Graph extends React.Component {

    static contextTypes = {
        transport: PropTypes.object,
        graphPreparer: PropTypes.object,
    }

    constructor(){

        super()

        this.state = {}

        this._update = () => this.setState({
            points: this.context.graphPreparer.getPoints()
        })
    }

    componentWillMount(){

        this.context.graphPreparer.on('change', this._update)

        this._update()
    }

    componentWillUnMount(){
        this.context.graphPreparer.removeListener('change', this._update)
    }

    render(){
        return (

            <div/>

        )
    }
}
