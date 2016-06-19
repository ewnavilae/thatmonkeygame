import React, { Component } from "react"
import { Motion, spring } from "react-motion"
import { roundTo } from "helpers"
import { List } from "immutable"
import * as styles from "./styles.css"

const getKeyStyles = key => [
  styles.key,
  key.pressed ? styles.keyDown : "",
  !key.unlocked ? styles.locked : "",
  key.menu ? styles.menuVisible : "",
].join( " " )

const notiSpring = springTo => spring( springTo, { stiffness: 50, damping: 40 } )

const notificationRenderer = notification => {
  const targetStyle = {
    bottom: notiSpring( notification.bottom ),
    left: notiSpring( notification.left ),
    opacity: notiSpring( 0 ),
    fontSize: notiSpring( 40 ),
  }
  return (
  <Motion
    key={notification.time}
    style={targetStyle}
    defaultStyle={{ bottom: 0, left: 0, opacity: 1, fontSize: 20 }}
  >
    {s => (
      <div style={s} className={`${ styles.notification }`}>
        {notification.text}
      </div>
    ) }
  </Motion>
  )
}

export default class Key extends Component {

  props:{
    notifications: List,
    points: number,
    keyboardKey: string,
    keys: any,
    toggleKeyMenu: ( key:string ) => void,
    unlockKey: ( key:string ) => void,
    keyCost: ( key:string ) => void,
    keyUp: ( key:string ) => void,
    keyDown: ( key:string ) => void,
  }

  render () {
    const {
      keyboardKey: key,
      notifications,
      toggleKeyMenu,
      unlockKey,
      keyCost,
      keyDown,
      points,
      keyUp,
      keys,
    } = this.props

    return (
      <div
        onMouseLeave={() => toggleKeyMenu( key )}
        onMouseEnter={() => toggleKeyMenu( key )}
        onMouseDown={() => keyDown( key )}
        onMouseUp={() => keyUp( key )}
        onTouchStart={() => keyDown( key )}
        onTouchEnd={() => keyUp( key )}
        key={key}
        className={getKeyStyles( keys[ key ] )}
      >
        <div>
          {key}
        </div>
        { keys[ key ].menu ? (
          <div className={styles.keyMenu}>
            <div className={styles.keyMenuTitle}>{key.toString()}</div>
            <div className={styles.keyMenuPrice}>{roundTo( keyCost, 0 )}</div>
            <div className={`${ styles.keyBuy } ${ points >= keyCost ? styles.keyAffordable : styles.keyExpensive }`}
              onClick={() => unlockKey( key )}
            >
              BUY
            </div>
          </div>
          ) :
          null
        }
        {notifications ? notifications.toJS().map( notificationRenderer ) : null}
      </div>
    )
  }
}
