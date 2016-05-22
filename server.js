/* eslint-env node*/
var webpack = require( "webpack" )
var webpackDevMiddleware = require( "webpack-dev-middleware" )
var webpackHotMiddleware = require( "webpack-hot-middleware" )
var config = require( "./webpack.config" )
var compression = require( "compression" )
var app = new ( require( "express" ) )()
var port = process.argv[ 2 ] ? process.argv[ 2 ] : 3000
var compiler = webpack( config )
app.use(
  compression( {
    level: 9,
    filter: () => true,
  } )
)

app.use( webpackDevMiddleware( compiler, { noInfo: true, publicPath: config.output.publicPath } ) )
app.use( webpackHotMiddleware( compiler ) )

app.listen( port, "0.0.0.0", function ( error ) {
  if ( error ) {
    console.error( error )
  } else {
    console.info( "==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port )
  }
} )
