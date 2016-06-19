import React, { Component } from "react"
import * as styles from "./styles.css"
import upgrades from "game/upgrades"
import achievements from "game/achievements"
import monkeys from "game/monkeys"
import { roundTo, objectMap } from "helpers"

const upgradePurchased = ( game, upgrade ) => game.getIn( [ "upgrades", upgrade ] ) ? true : false

const achievementRenderer = ( { game } ) => ( { unlocked, title, short } ) => unlocked( game ) ? ( //eslint-disable-line
  <div
    className={`${ styles.upgrade }`}
  >
    <div className={styles.upgradeName}>{title}</div>
    <div className={styles.upgradeShort}>{short}</div>
  </div>
) : null

const upgradeRenderer = ( props ) => ( upgrade ) => {
  const { game } = props //eslint-disable-line
  if ( !upgradePurchased( game, upgrade.key ) ) return null

  return (
    <div
      className={`${ styles.upgrade }`}
    >
      <div className={styles.upgradeName}>{upgrade.name}</div>
      <div className={styles.upgradeShort}>{upgrade.short}</div>
    </div>
  )
}

const statsLabelValue = ( label, value ) => (
  <div className={styles.statsRow}>
    <div className={styles.statsLabel}>{label}</div>
    <div className={styles.statsValue}>{roundTo( value, 2 )}</div>
  </div>
)

const monkeyPPS = ( game, pointsPerMonkeyPress ) =>
  monkeys.reduce( ( memo, current ) => ( {
    totalPPS: memo.totalPPS + current.amountPerTick( memo.monkeyIndex, { props: { game, pointsPerMonkeyPress } } ) * (
      1000 / current.interval
    ),
    monkeyIndex: memo.monkeyIndex + 1,
  } ), { monkeyIndex: 0, totalPPS: 0 } ).totalPPS || 0

const currentStats = ( { game, pointsPerAdd, pointsPerMonkeyPress } ) => ( //eslint-disable-line
  <div className={styles.stats}>
    <div className={styles.title}>Current Stats</div>
    <div className={styles.list}>
      {statsLabelValue( "Points", game.get( "points" ) )}
      {statsLabelValue( "Total Points", game.get( "totalPoints" ) )}
      {statsLabelValue( "Unlocked Keys", game.get( "unlocked" ).count( key => key && key.get( "unlocked" ) ) )}
      {statsLabelValue( "Points Per Key Press", pointsPerAdd )}
      {statsLabelValue( "Total Monkey PPS", monkeyPPS( game, pointsPerMonkeyPress ) )}
    </div>
  </div>
)

export default class Profile extends Component {

  props:{
    game: any,
    pointsPerAdd: number,
    pointsPerMonkeyPress: number,
  }

  render () {
    const { game, pointsPerAdd, pointsPerMonkeyPress } = this.props
    return (
      <div className={styles.profile}>
        {currentStats( { game, pointsPerAdd, pointsPerMonkeyPress } )}
        <div className={styles.upgrades}>
          <div className={styles.title}>
            Unlocked upgrades
          </div>
          <div className={styles.list}>
            { objectMap( upgrades, upgradeRenderer( this.props ) )}
          </div>
        </div>
        <div className={styles.achievements}>
          <div className={styles.title}>
            Achievements unlocked
          </div>
          <div className={styles.list}>
            { objectMap( achievements, achievementRenderer( this.props ) )}
          </div>
        </div>
      </div>
    )
  }
}
