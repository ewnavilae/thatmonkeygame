import React, { Component } from "react"
import monkeys from "game/monkeys"
import Monkey from "./monkey"
import * as styles from "./styles.css"

import { fromJS } from "immutable"

const monkeyRenderer = ( props ) => ( monkey, index ) =>
  <Monkey {...props} notifications={props.notifications.get(index)} monkey={monkey} index={index}/> // eslint-disable-line

export default class Monkeys extends Component {

  state = {
    notifications: fromJS( monkeys.map( () => [] ) ),
  }

  props:{
    game: any,
    pointsPerMonkeyPress: number,
    actions:{
      buyMonkey: ( id: number, price: number ) => void,
      addPoints: ( points: number ) => void,
    }
  };
  addNotification ( index, notification ) {
    const { notifications } = this.state
    this.setState( {
      notifications: notifications.update( index, thisNotifications =>
        thisNotifications.unshift( notification )
      ),
    } )
  }
  removeNotification ( index, notification ) {
    const { notifications } = this.state
    const notificationIndex = notifications.get( index ).indexOf( notification )
    this.setState( {
      notifications: notifications.update( index, thisNotifications =>
        thisNotifications.delete( notificationIndex )
      ),
    } )
  }

  notify ( index, notification, addBit, removeBit ) {
    setTimeout( () => {
      this.addNotification( index, notification )
      setTimeout( () => {
        this.removeNotification( index, notification )
      }, removeBit )
    }, addBit )
  }

  shouldComponentUpdate ( /* nextProps, nextState */ ) {
    return true
  }

  componentWillMount () {
    const { addPoints } = this.props.actions
    this.monkeyTimers = []
    monkeys.forEach( ( monkey, index ) => {
      this.monkeyTimers.push( setInterval( () => {
        const amountPerTick = monkey.amountPerTick( index, this )
        amountPerTick > 0 && addPoints( amountPerTick )
        const notification = fromJS( { monkey: monkey, text: amountPerTick, time: Date.now() } )
        amountPerTick > 0 && this.notify( index, notification, 0, 1000 )
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
    const { game, pointsPerMonkeyPress, actions: { buyMonkey } } = this.props
    const { notifications } = this.state
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
