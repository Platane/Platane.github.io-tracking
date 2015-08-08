import React, {Component, PropTypes} from "react"
import {HorizontalAxe } from "./horizontalAxe"
import {VerticalAxe } from "./verticalAxe"


export class Grid extends Component {

    render(){
        return (
            <g>
                <HorizontalAxe {...this.props}/>
                <VerticalAxe {...this.props}/>
            </g>
        )
    }
}
