import React, { Component } from "react"
import { monkeys } from "./monkeys"
import { roundTo } from "helpers"
import { Motion, spring } from "react-motion"
import { DialValue } from "components"

import * as styles from "./styles.css"

const isFirstLockedMonkey = ( index, game ) => {
  let firstLocked = -1
  for ( var i = 0; i < monkeys.length; i++ ) {
    if ( !monkeys[ i ].condition( game ) ) {
      firstLocked = i
      break
    }
  }
  return firstLocked === index
}

export const firstLockedMonkey = ( index, game, monkey ) => isFirstLockedMonkey( index, game ) ? (
  <div className={styles.monkeyPreview}>{monkey.preview()}</div>
) : null


const notiSpring = springTo => spring( springTo, { stiffness: 50, damping: 40 } )

const notificationRenderer = notification => (
  <Motion
    key={notification.time}
    defaultStyle={{ bottom: 0, opacity: 1 }}
    style={{ bottom: notiSpring( 90 ), opacity: notiSpring( 0.3 ) }}>
    {s => (
      <div style={s} className={`${ styles.notification }`}>
        {notification.monkey.icon || notification.monkey.name} smashes you {notification.text} points!
      </div>
    ) }
  </Motion>

)

const monkeyPriceStyles = ( { points, price, amount } ) => {
  const defaultStyle = styles.monkeyPriceValue
  const affordStyle = styles.monkeyPriceAffordable
  const cantAffordStyle = styles.monkeyPriceExpensive

  const canAfford = price( amount ) <= points

  return `${ defaultStyle }, ${ canAfford ? affordStyle : cantAffordStyle }`
}

const maxAffordable = ( priceFunction, amount, points ) => {
  let currAmount = amount
  let currPoints = points
  let canBuy = 0
  while ( currPoints >= 0 && priceFunction( currAmount ) <= currPoints ) {
    currPoints -= priceFunction( currAmount )
    currAmount++
    canBuy++
  }
  return canBuy
}

export default class Monkey extends Component {

  state = { }

  props:{
    points: number,
    index: number,
    monkey: any,
    game: any,
    buyMonkey: () => void,
    notifications: any,
  }

  mouseInBuy () {
    this.setState( { showDial: true } )
  }

  mouseLeave () {
    this.setState( { showDial: false } )
  }

  shouldComponentUpdate ( nextProps, nextState ) {
    if ( this.state.showDial || nextState.showDial ) return true

    const { game, monkey, index, notifications } = this.props
    const { game: nextGame, notifications: nextNotifications } = nextProps

    const amount = game.getIn( [ "monkeys", index ] )
    const monkeyPrice = monkey.price( amount )

    if ( !game.get( "unlocked" ).equals( nextGame.get( "unlocked" ) ) )
      return true
    if ( game.get( "points" ) < monkeyPrice && nextGame.get( "points" ) >= monkeyPrice )
      return true
    if ( !notifications.equals( nextNotifications ) )
      return true

    return false
  }

  purchaseX ( buyAmount ) {
    const { buyMonkey, game, monkey, index } = this.props
    const amount = game.getIn( [ "monkeys", index ] ) || 0
    let purchased = 0
    while ( purchased < buyAmount ) {
      buyMonkey( index, monkey.price( amount ) )
      purchased++
    }
    this.setState( { showDial: false } )
  }

  render () {
    const { monkey, game, index, points, notifications } = this.props
    const { showDial } = this.state

    const monkeyAmount = game.getIn( [ "monkeys", index ] ) || 0
    const _maxAffordable = maxAffordable( monkey.price, monkeyAmount, points )

    const Buy = ( value ) => (
      <div
        className={styles.buyMonkey}
        onMouseEnter={() => this.mouseInBuy()}
      >
        BUY {value}
      </div>
    )

    return monkey.condition( game ) || firstLockedMonkey( index, game, monkey ) ? (
        <div className={styles.monkey}>
          <div className={styles.monkeyName}>{monkey.name}</div>
          {monkey.condition( game ) ? ( [
            ( <div className={styles.monkeyDescription}>{monkey.description}</div> ),
            ( <div className={styles.monkeyPrice}>
              <span className={styles.monkeyPriceLabel}>Cost: </span>
              <span className={monkeyPriceStyles( { points, price: monkey.price, amount: monkeyAmount } )}>
                {roundTo( monkey.price( monkeyAmount ), 2 )}
              </span>
              <span className={styles.monkeyPriceLabel}> pts.</span>
              </div> ),
            ( <div className={styles.monkeyAmount}>
                {monkeyAmount}
              </div> ),
            ( showDial ? <DialValue
              round
              maxValue={_maxAffordable}
              click={( value ) => this.purchaseX( value )}
              close={() => this.mouseLeave()}
            >
              { Buy }
            </DialValue> : ( Buy() )
          ), ( notifications.toJS().map( notificationRenderer ) ),
          ] ) : firstLockedMonkey( index, game, monkey ) }
        </div>
      ) : null
  }
}
