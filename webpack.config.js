var path = require("path")
var webpack = require("webpack")

var production = process.argv.indexOf("--production") > -1


module.exports = {

  entry: {
    script: [
      "./front-src/script/app.js",
    ],
  },

  output: {
    path: path.join(__dirname, "front-dist"),
    filename: "[name].js",
    publicPath: "/",
  },

  module: {

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          "babel"
        ],
      },

    ]
  }

}
