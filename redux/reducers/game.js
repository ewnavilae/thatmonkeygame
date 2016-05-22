import { fromJS } from "immutable"
import * as gameActions from "redux/actions"

const initialState = fromJS( {
  points: 0,
  totalPoints: 0,
  totalKeys: 0,
  money: 0,
  unlocked: {
    q: {
      unlocked: true,
    },
  },
  monkeys: [],
  upgrades: {},
} )

let callbacks = {}

callbacks[ gameActions.RESET_INITIAL_STATE ] = () => initialState

callbacks[ gameActions.UNLOCK_UPGRADE ] = ( state, { key, price, upgrade } ) =>
  state.get( "points" ) > price && !state.getIn( [ "upgrades", key ] ) ?
    state.setIn( [ "upgrades", key ], fromJS( upgrade ) )
    .set( "points", state.get( "points" ) - price )
  : state

callbacks[ gameActions.BUY_MONKEY ] = ( state, { id, price } ) =>
  state.get( "points" ) > price ?
    state.setIn( [ "monkeys", id ], state.getIn( [ "monkeys", id ] ) ? state.getIn( [ "monkeys", id ] ) + 1 : 1 )
    .set( "points", state.get( "points" ) - price )
  : state

callbacks[ gameActions.UNLOCK_KEY ] = ( state, { key, price } ) =>
  price <= state.get( "points" ) ?
    state.setIn( [ "unlocked", key ], fromJS( { unlocked: true } ) )
    .set( "points", state.get( "points" ) - price )
  : state

callbacks[ gameActions.SET_POINTS ] = ( state, { points } ) => state.set( "points", points )

callbacks[ gameActions.ADD_POINTS ] = ( state, { points } ) =>
  state.set( "points", state.get( "points" ) + points )
  .set( "totalPoints", state.get( "totalPoints" ) + points )
  .set( "totalKeys", state.get( "totalKeys" ) + points )

callbacks[ gameActions.TAKE_POINTS ] = ( state, { points } ) => state.set( "points", state.get( "points" ) - points )

export default ( state = initialState, action ) =>
  callbacks[ action.type ] ? fromJS( callbacks[ action.type ]( state, action ) ) : state
