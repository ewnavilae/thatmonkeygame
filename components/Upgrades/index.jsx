import React, { Component } from "react"
import { roundTo } from "helpers"
import * as styles from "./styles.css"
import upgrades from "game/upgrades"

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
