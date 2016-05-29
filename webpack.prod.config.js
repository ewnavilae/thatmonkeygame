/* eslint-env node*/
var path = require( "path" )
var webpack = require( "webpack" )
var HtmlWebpackPlugin = require( "html-webpack-plugin" )

module.exports = {
  entry: [
    "./index.jsx",
  ],
  output: {
    path: path.join( __dirname, "dist" ),
    chunkFilename: "[name].[chunkhash].chk.js",
    filename: "bundle.[hash].js",
    publicPath: "/",
  },
  resolve: {
    root: path.resolve( "./" ),
    extensions: [ ".jsx", "", ".js" ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin( "shared.[hash].js" ),
    new HtmlWebpackPlugin( {
      filename: "index.html",
      template: "index.template.html",
      inject: false,
    } ),
    new webpack.DefinePlugin( {
      __DEV__: process.env.DEV ? true : false,
      __LIVE__: false,
      "process.env": {
        NODE_ENV: "\"production\"",
      },
    } ),
    new webpack.optimize.UglifyJsPlugin( {
      compressor: {
        warnings: false,
        drop_console: true,
        dead_code: true,
        unsafe: true,
      },
    } ),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [ "babel" ],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.css$/,
        loader: "style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader",
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=[hash].[ext]",
          "image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false",
        ],
      },
      {
        test: /\.svg$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=[hash].[ext]",
        ],
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      /* {
        test: /\.js?$/,
        loader: "uglify"
      }*/
    ],
  },
  postcss: [
    require( "autoprefixer-core" ),
    require( "postcss-normalize" ),
  ],
  "uglify-loader": {
    mangle: true,
  },
}
