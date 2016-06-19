import React, { Component } from "react"
import monkeys from "game/monkeys"
import Monkey from "./monkey"
import * as styles from "./styles.css"
import { notifier } from "helpers"
import { fromJS } from "immutable"

const monkeyRenderer = ( props ) => ( monkey, index ) =>
  <Monkey {...props} notifications={props.notifications.get(index)} monkey={monkey} index={index}/> // eslint-disable-line

@notifier()
export default class Monkeys extends Component {

  props:{
    game: any,
    pointsPerMonkeyPress: number,
    notify: any,
    notifications: any,
    actions:{
      buyMonkey: ( id: number, price: number ) => void,
      addPoints: ( points: number ) => void,
    }
  };

  shouldComponentUpdate ( /* nextProps, nextState */ ) {
    return true
  }

  componentWillMount () {
    const { notify, actions: { addPoints } } = this.props
    this.monkeyTimers = []
    monkeys.forEach( ( monkey, index ) => {
      this.monkeyTimers.push( setInterval( () => {
        const amountPerTick = monkey.amountPerTick( index, this )
        amountPerTick > 0 && addPoints( amountPerTick )
        const notification = fromJS( { monkey: monkey, text: amountPerTick, time: Date.now() } )
        amountPerTick > 0 && notify( index, notification, 0, 1000 )
      }, monkey.interval ) )
    } )
  }

  componentWillUnmount () {
    this.monkeyTimers.forEach( timer => clearInterval( timer ) )
  }

  buyMonkey () {
    // this.setState({})
  }

  render () {
    const { game, pointsPerMonkeyPress, actions: { buyMonkey }, notifications } = this.props
    return (
      <div className={styles.monkeys}>
        {monkeys.map( monkeyRenderer( {
          pointsPerMonkeyPress,
          game,
          notifications,
          buyMonkey, // : ( args ) => buyMonkey( ...args ),
          points: game.get( "points" ),
        } ) ) }
      </div>
    )
  }
}
