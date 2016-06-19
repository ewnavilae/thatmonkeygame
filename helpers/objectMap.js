export default ( object, map ) => {
  const res = []
  let index = 0
  for ( var variable in object ) {
    if ( object.hasOwnProperty( variable ) ) {
      res.push( map( { ...object[ variable ], key: variable }, index ) )
    }
    index++
  }
  return res
}
