import React, {Component} from "react"

export class FatLine extends React.Component {

    render(){


        const line = this.props.line.slice()
        const height = this.props.height || 20
        const lineWidth = this.props.lineWidth || height * 0.2

        let extrudDir = {x:0, y:-1}
        let shadowDir = {x:0.707, y:0.707}

        extrudDir.x *= height
        extrudDir.y *= height

        shadowDir.x *= 500
        shadowDir.y *= 500



        const bottomPath = line.reduce( (path, p) =>
            path + p.x +','+ p.y+ ' ', '' )

        line.reverse()

        const upPath = line.reduce( (path, p) =>
            path + (p.x+extrudDir.x) +','+ (p.y+extrudDir.y) + ' ', '' )


        let first = line[ line.length-1 ]
        let last = line[ 0 ]


        const shadowPoly = (first.x+shadowDir.x) +','+ (first.y+shadowDir.y) + ' ' + bottomPath + (last.x+shadowDir.x) +','+ (last.y+shadowDir.y)

        // x1="100" y1="100" x2="300" y2="300"

        return (
            <g>

                <defs>
                    <linearGradient id="shadow" x1="0" y1="0" x2="0.6" y2="0.6">
                        <stop stopColor="rgb(50,50,50)" stopOpacity="0.25" offset="0%"/>
                        <stop stopColor="rgb(50,50,50)" stopOpacity="0" offset="100%"/>
                    </linearGradient>
                </defs>

                <polygon  points={shadowPoly} fill="url(#shadow)" style={ {stroke:'none'} } />

                <polyline  points={bottomPath} style={ {fill: 'none', stroke:'rgba(50,50,50,0.4)', strokeLinecap: 'round', strokeWidth: lineWidth*0.9} } />

                <polygon  points={bottomPath+' '+upPath} style={ {fill: '#aaa', stroke:'none'} } />

                <polyline  points={upPath} style={ {fill: 'none', stroke:'#fff', strokeLinecap: 'round', strokeWidth: lineWidth} } />

            </g>
        )
    }
}
