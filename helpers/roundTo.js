import numeral from "numeral"
export default ( number, points ) =>
  numeral( Math.round( number * ( 10 ** points ) ) / 10 ** points ).format( "0.[00]a" ).toUpperCase()
