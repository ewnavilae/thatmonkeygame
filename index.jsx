import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import Game from "./game"
import configureStore from "redux/store"

const store = configureStore()

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById( "root" )
)
