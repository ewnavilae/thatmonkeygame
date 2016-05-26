import React, { Component } from "react"
import { roundTo } from "helpers"
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

const getKeyStyles = key => [
  styles.key,
  key.pressed ? styles.keyDown : "",
  !key.unlocked ? styles.locked : "",
  key.menu ? styles.menuVisible : "",
].join( " " )

const renderKey = ( { points, keys, toggleKeyMenu, unlockKey, keyCost } ) => key => (
  <div
    onMouseLeave={() => toggleKeyMenu( key )}
    onMouseEnter={() => toggleKeyMenu( key )}
    key={key}
    className={getKeyStyles( keys[ key ] )}
  >
    <div>
      {key}
    </div>
    { keys[ key ].menu ? (
      <div className={styles.keyMenu}>
        <div className={styles.keyMenuTitle}>{key.toString()}</div>
        <div className={styles.keyMenuPrice}>{roundTo( keyCost, 2 )}</div>
        <div className={`${ styles.keyBuy } ${ points >= keyCost ? styles.keyAffordable : styles.keyExpensive }`}
          onClick={() => unlockKey( key )}
        >
          BUY
        </div>
      </div>
      ) :
      null
    }
  </div>
)

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

export default class Keyboard extends Component {

  props:{
    points: number,
    addPoints: () => void,
    unlockKey: ( key:string, price:number ) => void,
    unlocked:{
      [key:string]:boolean,
    }
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
    unlockKey( keyCode, this.keyCost() )
  }

  keyDown ( event ) {
    const { keys } = this.state
    const charCode = String.fromCharCode( event.which ).toLowerCase()
    const key = keys[ charCode ]
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
    }
    event.preventDefault()
  }

  keyUp ( event ) {
    const { keys } = this.state
    const charCode = String.fromCharCode( event.which ).toLowerCase()
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
    event.preventDefault()
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
    return 10 * ( 1.20 ** ( countUnlocked( keys ) * 4 ) )
  }

  shouldComponentUpdate ( nextProps, nextState ) {
    const { keys } = this.state
    const { keys: nextKeys } = nextState
    return keys !== nextKeys
  }

  render () {
    const { points } = this.props
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
            toggleKeyMenu: this.toggleKeyMenu,
            unlockKey: this.unlockKey,
            keyCost: this.keyCost(),
          } ) ) }
        </div>
      </div>
    )
  }
}
