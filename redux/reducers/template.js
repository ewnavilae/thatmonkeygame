export default ( ACTIONS, callbacks, state, action ) => {
  var _action = ACTIONS.indexOf( action.type )
  var _callback = ( callbacks[ action.type ] !== undefined )
  if ( _action > -1 && _callback ) {
    return ( callbacks[ action.type ]( state, action ) ) }
  else
    return state
}
