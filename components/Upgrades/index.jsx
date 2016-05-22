import React, { Component } from "react"
import { roundTo } from "helpers"
import * as styles from "./styles.css"

export const PLAYER_PRESS_UPGRADE = "PLAYER_PRESS_UPGRADE"
export const CODE_MONKEY_UPGRADE = "CODE_MONKEY_UPGRADE"
export const DEV_MONKEY_UPGRADE = "DEV_MONKEY_UPGRADE"

const upgrades = [
  {
    key: "REDBULL_MONKEY",
    type: CODE_MONKEY_UPGRADE,
    name: "Redbull Code",
    description: "What happens if your code monkeys get redbull instead of coffee?",
    tier: 1,
    price: 250,
    unlocked: ( game ) => game.getIn( [ "monkeys", 0 ] ) >= 10,
  },
  {
    key: "APPLE_MONKEY",
    type: DEV_MONKEY_UPGRADE,
    name: "Apple Coders",
    description: "Get your web developers some nice apple computers",
    tier: 1,
    price: 1500,
    unlocked: ( game ) => game.getIn( [ "monkeys", 1 ] ) >= 10,
  },
  {
    key: "SUPER_TYPIST",
    type: PLAYER_PRESS_UPGRADE,
    name: "Super Typist",
    description: "You type fast and can program more, double points per press!",
    tier: 1,
    price: 250,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 100,
  }, {
    key: "REAL_PROGRAMMER",
    type: PLAYER_PRESS_UPGRADE,
    name: "Real Programmer",
    description: "You type more than random words, should make you more productive! Double points per press!",
    tier: 2,
    price: 2500,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 1000,
  },
]

const upgradePurchased = ( game, upgrade ) => game.getIn( [ "upgrades", upgrade ] ) ? true : false

const upgradeRenderer = ( props ) => ( upgrade ) => {
  const { game, actions: { unlockUpgrade } } = props //eslint-disable-line
  if ( !upgrade.unlocked( game ) || upgradePurchased( game, upgrade.key ) ) return null

  const sameTypeUpgrades = upgrades.filter( _upgrade => _upgrade.type === upgrade.type ).sort( ( a, b ) => a - b )
  const previous = sameTypeUpgrades.find( _upgrade => _upgrade.tier === upgrade.tier - 1 )
  if ( previous && !upgradePurchased( game, previous.key ) ) return null

  const canAfford = game.get( "points" ) >= upgrade.price
  const priceStyle = canAfford ? styles.upgradePriceAffordable : styles.upgradePriceExpensive

  return (
    <div
      className={`${ styles.upgrade } ${ canAfford ? styles.upgradeAffordable : styles.upgradeExpensive }`}
      onClick={() => unlockUpgrade( upgrade )}
    >
      <div className={styles.upgradeName}>{upgrade.name}</div>
      <div className={styles.upgradeDescription}>{upgrade.description}</div>
      <div className={`${ styles.upgradePrice } ${ priceStyle }`}>{roundTo( upgrade.price, 2 )}</div>
    </div>
  )
}

export default class Upgrades extends Component {

  props:{
    game: any,
    actions: {
      unlockUpgrade: ( upgrade:{
        key: string,
        price: number,
      } ) => void,
    },
  }

  render () {
    return (
      <div className={styles.upgrades}>
        {upgrades.map( upgradeRenderer( this.props ) )}
      </div>
    )
  }
}
