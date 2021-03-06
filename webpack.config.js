var path = require('path')
var webpack = require('webpack')

var production = process.argv.indexOf('--production') > -1


var plugins = []

if ( production )
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        })
    )

module.exports = {

    entry: {
        script: [
            './front-src/script/app.js',
        ],
    },

    output: {
        path: path.join(__dirname, 'front-dist'),
        filename: '[name].js',
        publicPath: '/',
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'babel?stage=0&sourceMaps="both"'
                ],
            },

            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'babel?stage=0&sourceMaps="both"'
                ],
            }

        ]
    },

    plugins: plugins

}
