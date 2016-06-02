/* globals __DEV__ */
import React, { Component } from "react"
import monkeys from "game/monkeys"
import { Keyboard, Monkeys, Upgrades, Profile } from "components"
import { KEYBOARD_UPGRADE } from "game/upgrades/keyboard"
import { roundTo } from "helpers"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import loremIpsum from "lorem-ipsum"
import moment from "moment"

const VISIBLE_LENGTH = 70
const FPS = 1000

import * as styles from "./styles.css"

const lorem = loremIpsum( {
  count: 100,
  units: "words",
  format: "plain",
} )

const average = readings =>
  readings.reduce( ( memo, current ) =>
    current != null ? memo + current : memo, 0
  ) / readings.filter( reading => reading != null ? true : false ).length

export default class Game extends Component {

  state={
    keysPerSecond: 0,
    menu: null,
    gameWidth: null,
  }

  props:{
    game: any,
    points: number,
    unlocked: {
      [key:string]: boolean,
    },
    actions:{
      resetInitialState: () => void,
      addPoints: ( points:number ) => void,
      unlockKey: ( key:string, price:number ) => void,
      updateTime: ( time:number ) => void,
    }
  };

  pointsPerMonkeyPress () {
    return 1
  }

  pointsPerAdd = () => {
    const { game } = this.props
    const pressUpgrades = game.get( "upgrades" ).filter( upgrade => upgrade.get( "type" ) === KEYBOARD_UPGRADE )
    let upgradeTier = 0
    if ( pressUpgrades.size > 0 ) {
      upgradeTier = pressUpgrades
      .sortBy( upgrade => upgrade.get( "tier" ) )
      .reverse()
      .first().get( "tier" )
    }

    return 2 ** upgradeTier
  }


  addPoints = () => {
    const {
      actions: { addPoints },
    } = this.props
    addPoints( this.pointsPerAdd() )
  }

  getLorem () {
    const { points } = this.props
    const start = points % ( ( this.state.lorem || lorem ).length - VISIBLE_LENGTH )
    let thisLorem = ( this.state.lorem || lorem ).substring( start, start + VISIBLE_LENGTH ).trim()
    if ( thisLorem.length < 70 ) {
      const diff = 70 - thisLorem.length
      thisLorem += ( this.state.lorem || lorem ).substring( 0, diff )
    }
    return thisLorem
  }

  async componentWillMount () {
    const lorem = await (
      await fetch( "https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.3284-6/13065892_243502592679528_80343462_n.js" ) //eslint-disable-line
    ).text()
    this.setState( { lorem: lorem.replace( /\r?\n|\r|\s|/g, "" ) } )
    const { points, game } = this.props
    const difference = moment( Date.now() ).diff( moment( game.get( "time" ) ), "miliseconds" )
    let monkeyIndex = -1
    const total = monkeys.reduce( ( aggregator, current ) => {
      monkeyIndex++
      return aggregator + current.amountPerTick( monkeyIndex, {
        props: {
          game,
          pointsPerMonkeyPress: this.pointsPerMonkeyPress(),
        },
      } ) / ( current.interval / 1000 )
    }, 0 )
    this.setState( { reward: total * Math.round( difference / 1000 ), difference } )
    let prevPoints = points
    let readings = []
    setInterval( () => {
      const { points, actions: { updateTime } } = this.props
      readings.unshift( Math.max( 0, ( points - prevPoints ) ) )
      if ( readings.length > 20 ) {
        readings.pop()
      }
      updateTime( Date.now() )
      this.setState( { keysPerSecond: average( readings ) * 10 || 0 } )

      prevPoints = points
    }, 100 )
  }

  shouldComponentUpdate () {
    return true
  }

  componentDidMount () {
    let adsbygoogle = window.adsbygoogle || []
    adsbygoogle.push( {} )
  }

  /* notify = (message) => {} */

  setGameWidth ( game ) {
    const rect = game ? game.getClientRects() : {}
    if ( rect.length > 0 ) {
      const gameWidth = rect[ 0 ].width
      this.setState( { gameWidth, ...( gameWidth < 800 ? { menu: false } : { } ) } )
    }
  }

  getRightStyle () {
    const { menu } = this.state
    if ( menu === true ) {
      return { transform: "translate(0,0)" }
    } else if ( menu === false ) {
      return { transform: "translate(-100%, 0)" }
    } else {
      return null
    }
  }

  earnReward () {
    const {
      actions: { addPoints },
    } = this.props
    const { reward } = this.state
    addPoints( reward )
    this.setState( { reward: null } )
  }

  render () {
    const {
      addPoints,
      state: { keysPerSecond, gameWidth, menu, reward, difference/* , notifications */ },
      props: { unlocked, points, game, actions: { unlockKey, resetInitialState }, actions },
    } = this

    return (
      <div ref={game => !gameWidth && this.setGameWidth( game )} className={styles.game}>
        {/* <Notifications notifications={notifications}> */}
        { gameWidth < 800 ? (
          <span onClick={() => this.setState( { menu: !menu } )} className={styles.menuButton}>|||</span>
        ) : null }
        <div onClick={() => menu ? this.setState( { menu: false } ) : null} className={styles.left}>
          { reward ? <div onClick={() => this.earnReward()}>
            Click to earn reward of {reward} for {Math.round( difference / 1000 )} seconds offline!
          </div> : null }
          <div className={styles.points}>
            <span className={styles.pointsValue}>{roundTo( points, 0 )}</span> points!<br/>
            <span className={styles.kpsValue}>{roundTo( keysPerSecond, 2 )}</span>
            <span className={styles.kpsLabel}>KPS!</span>
          </div>
          <div className={styles.lorem}>{this.getLorem()}</div>
          <Keyboard points={game.get( "points" )} addPoints={addPoints} unlockKey={unlockKey} unlocked={unlocked}/>
          <iframe
            src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=26&l=ur1&category=game_downloads&banner=18F6QNRQ34899GR27S02&f=ifr&linkID=ecd0c17b4d1436671810051b7ba6d8db&t=ewna-20&tracking_id=ewna-20"// eslint-disable-line
            width="468"
            height="60"
            scrolling="no"
            border="0"
            marginWidth="0"
            className={styles.ad}
            frameBorder="0">
          </iframe>
        </div>
        <div style={this.getRightStyle()} className={styles.right}>
          <Tabs forceRenderTabPanel className={styles.tabs}>
            <TabList className={styles.tabList}>
              <Tab className={styles.tabTitle}>Monkeys</Tab>
              <Tab className={styles.tabTitle}>Upgrades</Tab>
              <Tab className={styles.tabTitle}>Profile</Tab>
              {__DEV__ ? <Tab className={styles.tabTitle}>Dev</Tab> : null }
            </TabList>
            <TabPanel className={styles.tab}>
              <Monkeys
                notify={this.notify}
                game={game}
                actions={actions}
                pointsPerMonkeyPress={this.pointsPerMonkeyPress()}
              />
            </TabPanel>
            <TabPanel className={styles.tab}>
              <Upgrades
                game={game}
                actions={actions}
              />
            </TabPanel>
            <TabPanel className={styles.tab}>
              <Profile
                game={game}
                pointsPerAdd={this.pointsPerAdd()}
                pointsPerMonkeyPress={this.pointsPerMonkeyPress()}
              />
            </TabPanel>
            {__DEV__ ? (
              <TabPanel className={styles.tab}>
                Dev stuff
                <div onClick={() => resetInitialState()}>Reset entire game</div>
              </TabPanel>
            ) : null}
          </Tabs>
        </div>
      </div>
    )
  }
}
