import * as storage from "redux-storage"
import { combineReducers } from "redux"
import game from "./game"

const reducer = storage.reducer( combineReducers( {
  game,
} ) )

export default reducer
