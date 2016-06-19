import React, { Component } from "react"
import { notifier } from "helpers"
import { fromJS } from "immutable"
import Key from "./Key"
import * as styles from "./styles.css"

// const random = ( ) => Math.random() <= Math.random()

const rows = /* () =>*/ [
  "qwertyuiop".split( "" ), // .order( random ),
  "asdfghjkl".split( "" ), // .order( random ),
  "zxcvbnm".split( "" ), // .order( random ),
]

const validKeys = "qwertyuiopasdfghjklzxcvbnm".split( "" )
const generateKeys = ( unlocked ) => {
  let keys = {}
  validKeys.forEach( key => keys[ key ] = {
    pressed: false,
    unlocked: false || ( unlocked[ key ] && unlocked[ key ].unlocked ),
  } )
  return keys
}

const renderKey = ( params ) => key =>
  <Key {...params} notifications={params.notifications.get( key )} keyboardKey={key}/>

const renderRow = params => ( row, index ) => (
  <div className={`${ styles.row } ${ styles[ `row_${ index }` ] }`} key={index}>
    {row.map( renderKey( params ) )}
  </div>
)

const menuOff = keys => {
  const res = { ...keys }
  for ( var key in keys ) {
    if ( keys.hasOwnProperty( key ) ) {
      res[ key ] = {
        ...keys[ key ],
        pressed: false,
        menu: false,
      }
    }
  }
  return res
}

const countUnlocked = keys => {
  let res = 0
  for ( var key in keys ) {
    if ( keys.hasOwnProperty( key ) ) {
      res = res + ( keys[ key ].unlocked ? 1 : 0 )
    }
  }
  return res
}

@notifier()
class Keyboard extends Component {

  props:{
    points: number,
    addPoints: () => void,
    unlockKey: ( key:string, price:number ) => void,
    unlocked:{
      [key:string]:boolean,
    },
    notify: any,
    notifications: any,
  }

  state = {
    focused: true,
  }

  toggleKeyMenu = ( keyCode ) => {
    const { keys } = this.state
    const key = keys[ keyCode ]
    if ( !key.unlocked ) {
      this.setState( { keys: { ...menuOff( keys ), [ keyCode ]: { ...key, menu: key.menu ? false : true } } } )
    }
  }

  unlockKey = ( keyCode ) => {
    const { unlockKey } = this.props
    unlockKey( keyCode, Math.round( this.keyCost() ) )
  }

  keyDown ( event ) {
    const { keys } = this.state
    const { pointsPerAdd, notifications, notify } = this.props
    const charCode = event.which ? String.fromCharCode( event.which ).toLowerCase() : event
    const key = keys[ charCode ]
    const notification = fromJS( {
      text: `${ charCode }`,
      time: Date.now(),
      left: Math.random() * 800 - 400,
      bottom: Math.random() * 800 - 400,
    } )

    notify(
      charCode,
      notification,
      0, 1500 - ( 50 * ( notifications.get( charCode ) ? notifications.get( charCode ).count() : 0 ) )
    )
    if ( ~validKeys.indexOf( charCode ) && !key.pressed && key.unlocked ) {
      const { addPoints } = this.props
      this.setState( {
        keys: {
          ...keys,
          [ charCode ]: {
            ...key,
            pressed: true,
          },
        },
      } )
      addPoints()
      event.preventDefault && event.preventDefault()
    }
  }

  keyUp ( event ) {
    const { keys } = this.state
    const charCode = event.which ? String.fromCharCode( event.which ).toLowerCase() : event
    const key = keys[ charCode ]
    if ( ~validKeys.indexOf( charCode ) && key.pressed ) {
      this.setState( {
        keys: {
          ...keys,
          [ charCode ]: {
            ...key,
            pressed: false,
          },
        },
      } )
    }
    event.preventDefault && event.preventDefault()
  }
  componentWillMount () {
    const { unlocked } = this.props
    const keys = generateKeys( unlocked.toJS() )
    this.setState( { keys } )
  }
  componentWillReceiveProps ( nextProps ) {
    const { unlocked } = this.props
    const nextUnlocked = nextProps.unlocked
    if ( !unlocked.equals( nextUnlocked ) ) {
      this.setState( { keys: generateKeys( nextUnlocked.toJS() ) } )
    }
  }

  componentDidMount () {
    this.keyboard.focus()
  }

  keyCost () {
    const { keys } = this.state
    const keyCount = countUnlocked( keys )
    return 10 * ( 1.20 ** ( ( keyCount < 11 ? keyCount : keyCount * 1.2 ) * 4 ) )
  }

  shouldComponentUpdate ( nextProps, nextState ) {
    const { keys } = this.state
    const { keys: nextKeys } = nextState
    return keys !== nextKeys
  }

  render () {
    const { points, notifications } = this.props
    const { keys, focused } = this.state
    return (
      <div
        tabIndex="0"
        enabled={false}
        ref={( keyboard ) => this.keyboard = keyboard}
        className={styles.keyboard}
        onKeyDown={( event ) => this.keyDown( event )}
        onKeyUp={( event ) => this.keyUp( event )}
        onFocus={() => this.setState( { focused: true } )}
        onBlur={() => window.setTimeout( () => {
          this.keyboard && this.keyboard.focus()
        }, 100 )}
      >
        { !focused ? <div className={styles.warning}>Keyboard not focused! Click it to play.</div> : null}
        <div className={styles.keys}>
          {rows.map( renderRow( {
            points,
            keys,
            notifications,
            toggleKeyMenu: this.toggleKeyMenu,
            unlockKey: this.unlockKey,
            keyCost: this.keyCost(),
            keyDown: key => this.keyDown( key ),
            keyUp: key => this.keyUp( key ),
          } ) ) }
        </div>
      </div>
    )
  }
}

export default Keyboard
