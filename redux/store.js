import { createStore, applyMiddleware } from "redux"
import * as storage from "redux-storage"
import thunk from "redux-thunk"
import reducer from "redux/reducers"
import createLogger from "redux-logger"


import createEngine from "redux-storage/engines/localStorage"
const engine = createEngine( "new-game-nosave" )
const storage_middleware = storage.createMiddleware( engine )
const logger = createLogger( {

} )

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  storage_middleware,
  // logger,
)( createStore )

export default initialState => {
  const reduxDev = window.devToolsExtension ? window.devToolsExtension() : f => f
  const store = createStoreWithMiddleware( reducer, initialState, reduxDev )

  const load = storage.createLoader( engine )
  load( store )

  return store
}
