import React from "react"

export const renderFat = ( points, options = {} ) => {

    if (!points.length)
        return <g/>

    const height = options.height || 20
    const lineWidth = options.lineWidth || height * 0.2

    const color = options.color || '#fff'
    const darkColor = options.darkColor || '#ccc'

    let extrudDir = {x:0, y:-1}
    let shadowDir = {x:0.707, y:0.707}

    extrudDir.x *= height
    extrudDir.y *= height

    shadowDir.x *= 400
    shadowDir.y *= 400

    // copy
    let line = points.slice()

    const first = line[ 0 ]
    const last = line[ line.length-1 ]

    const bottomPath = line.reduce( (path, p) =>
        path + p.x +','+ p.y+ ' ', '' )

    line.reverse()

    const upPath = line.reduce( (path, p) =>
        path + (p.x+extrudDir.x) +','+ (p.y+extrudDir.y) + ' ', '' )

    const shadowPoly = (first.x+shadowDir.x) +','+ (first.y+shadowDir.y) + ' ' + bottomPath + (last.x+shadowDir.x) +','+ (last.y+shadowDir.y)


    return (
        <g>

            <defs>
                <linearGradient id="shadow" x1="0" y1="0" x2="0.6" y2="0.6">
                    <stop stopColor="rgb(50,50,50)" stopOpacity="0.25" offset="0%"/>
                    <stop stopColor="rgb(50,50,50)" stopOpacity="0" offset="100%"/>
                </linearGradient>
            </defs>

            <polygon  points={shadowPoly} fill="url(#shadow)" style={ {stroke:'none'} } />

            <polyline  points={bottomPath} style={ {fill: 'none', stroke:'rgba(50,50,50,0.2)', strokeLinecap: 'round', strokeWidth: lineWidth} } />

            <polygon  points={bottomPath+' '+upPath} style={ {fill: darkColor, stroke:'none'} } />

            <polyline  points={upPath} style={ {fill: 'none', stroke: color, strokeLinecap: 'round', strokeWidth: lineWidth} } />

        </g>
    )
}
export const renderBasic = ( points, options = {} ) =>
    <polyline
        points={ points.reduce( (path,p) => path+p.x+','+p.y+' ', '') }
        style={ {
            fill: 'none',
            stroke: options.color || '#555',
            strokeWidth: options.tickness || 1,
            strokeLinecap: 'round' } } />
