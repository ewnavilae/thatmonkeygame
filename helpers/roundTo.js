import numeral from "numeral"
export default ( number, points ) => {
  try {
    return numeral( points > 0 ? Math.round( number * ( 10 ** points ) ) / 10 ** points : Math.round( number ) )
    .format( "0.[00]a" ).toUpperCase()
  } catch ( e ) {
    console.log( e )
  }
}
