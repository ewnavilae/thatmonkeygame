import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Game } from "components"
import * as actions from "redux/actions"


const stateToProps = ( {
  game,
} ) => ( {
  game,
  unlocked: game.get( "unlocked" ),
  points: game.get( "points" ),
  totalKeys: game.get( "totalKeys" ),
} )

const dispatchToProps = dispatch => ( {
  dispatch,
  actions: bindActionCreators( actions, dispatch ),
} )

export default connect( stateToProps, dispatchToProps )( Game )
