import React, {Component, PropTypes} from 'react'
import {colorScheme, colorBack} from "../common/style.js"

const listStyle = {
    flexGrow: '1',

    display: 'flex',
    listStyleType: 'none',
    alignItems: 'center',
    justifyContent: 'space-around',

}
const sumStyle = {
    // fontWeight: 'bold',
    fontFamily: 'helvetica',

    fontSize: '50px',
    borderRadius: '999px',
    width: '130px',
    height: '130px',
    lineHeight: 2.6,
    boxSizing: 'border-box',
    textAlign: 'center',

    backgroundColor: colorBack,

    textShadow: Array.apply(null, Array( 20 ))
        .map( (_, i) => `${i}px ${i*0.5}px 1px #CD7E7E`) //#CD7E7E
        .join(',')
}

export class Literal extends Component {

    static contextTypes = {
        literalSum: PropTypes.object,
        pointsStore: PropTypes.object,
        action: PropTypes.object,
    }

    constructor(){
        super()

        this.state = {
            sums: {}
        }
    }

    componentWillMount(){

        this._update = () => {

            const events = this.context.pointsStore.getEvents()

            let sums = {}
            events.forEach( event =>
                sums[ event ] = this.context.literalSum.getSum( event )   )

            this.setState( {sums: sums} )
        }

        this.context.literalSum.on('change', this._update )

        this._update()
    }

    componentWillUnmount(){

        this.context.literalSum.removeListener('change', this._update )
    }

    componentWillReceiveProps( nextProps ){

        this.props= nextProps

        this._update()
    }

    render(){

        const { layout, selected } = this.props

        const sums = this.state.sums

        const events = this.context.pointsStore.getEvents()

        const colorByEvent = events.reduce( (o, x, i) =>
            (o[ x ] = colorScheme[ i % colorScheme.length ]) && o, {})

        return (

            <ul    style={ {...listStyle, flexDirection: layout == 'row' ? 'column' : 'row'} }>

                {events.map( x =>
                    <li  key={x} style={ {...sumStyle, color:colorByEvent[ x ]} } >{sums[ x ] || 0}</li>  )}

            </ul>
        )
    }
}
