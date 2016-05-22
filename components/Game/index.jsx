import React, { Component } from "react"
import { Keyboard, Monkeys, Upgrades } from "components"
import { PLAYER_PRESS_UPGRADE } from "components/Upgrades"
import { roundTo } from "helpers"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import loremIpsum from "lorem-ipsum"

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
    }
  };

  pointsPerMonkeyPress () {
    return 1
  }

  pointsPerAdd = () => {
    const { game } = this.props
    const pressUpgrades = game.get( "upgrades" ).filter( upgrade => upgrade.get( "type" ) === PLAYER_PRESS_UPGRADE )
    let upgradeTier = 0
    if ( pressUpgrades.size > 0 ) {
      upgradeTier = pressUpgrades
      .sortBy( upgrade => upgrade.get( "tier" ) )
      .reverse()
      .first().get( "tier" )
    }

    return 1 * ( 2 ** upgradeTier )
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
    const { points } = this.props
    let prevPoints = points
    let readings = []
    setInterval( () => {
      const { points } = this.props
      readings.unshift( Math.max( 0, ( points - prevPoints ) ) )
      if ( readings.length > 20 ) {
        readings.pop()
      }
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

  render () {
    const {
      addPoints,
      state: { keysPerSecond/* , notifications */ },
      props: { unlocked, points, game, actions: { unlockKey, resetInitialState }, actions },
    } = this

    return (
      <div className={styles.game}>
        {/* <Notifications notifications={notifications}> */}
        <div className={styles.left}>
          <div className={styles.points}>
            <span className={styles.pointsValue}>{roundTo( points, 0 )}</span> points!<br/>
            <span className={styles.pointsValue}>{roundTo( keysPerSecond, 2 )}</span> KPS!
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
            style={{ paddingTop: 100, border: "none" }}
            frameBorder="0">
          </iframe>
        </div>
        <div className={styles.right}>
          <Tabs forceRenderTabPanel className={styles.tabs}>
            <TabList className={styles.tabList}>
              <Tab className={styles.tabTitle}>Monkeys</Tab>
              <Tab className={styles.tabTitle}>Upgrades</Tab>
              <Tab className={styles.tabTitle}>Dev</Tab>
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
              Dev stuff
              <div onClick={() => resetInitialState()}>Reset entire game</div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}
