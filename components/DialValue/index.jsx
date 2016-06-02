import React, { Component } from "react"
import * as styles from "./styles.css"

export default class DialValue extends Component {

  props:{
    children: any,
    round: boolean,
    value: number,
    maxValue: number,
    update: ( value:number ) => void,
    close: () => void,
    click: () => void,
  }

  componentWillMount () {
    this.state = {
      willMountTime: Date.now(),
    }
  }

  mouseMove ( event ) {
    const { clientX } = event
    const { width, offsetLeft } = this.state
    const { maxValue, update, round } = this.props

    const mouseX = clientX - offsetLeft

    this.setState( { mouseX } )
    update && ( round ? Math.round( update( maxValue * mouseX / width ) ) : update( maxValue * mouseX / width ) )
  }

  mouseEnter () {
    debugger
    this.setState( { mouseEnterTime: Date.now(), mouseIn: true } )
  }

  mouseLeave () {
    const { close } = this.props
    this.setState( { mouseLeaveTime: Date.now(), mouseIn: false } )
    close && close()
  }

  setWidth = ( dial ) => {
    const clientRects = dial ? dial.getClientRects() : {}
    clientRects.length > 0 && this.setState( {
      width: dial.getClientRects()[ 0 ].width,
      offsetLeft: dial.getClientRects()[ 0 ].left,
    } )
  }

  shouldComponentUpdate ( nextProps, nextState ) {
    const { maxValue } = this.props
    const { maxValue: nextMax } = nextProps
    const { mouseX } = this.state
    const { mouseX: nextX } = nextState
    if ( mouseX !== nextX ) return true
    else if ( maxValue !== nextMax ) return true
    else return false
  }

  render () {
    const { mouseX, width } = this.state
    const { maxValue, round, children, click } = this.props
    const value = maxValue * mouseX / width || maxValue
    const displayValue = round ? Math.round( value ) : value
    return (
      <div
        ref={( dial ) => this.setWidth( dial )}
        className={styles.dialValue}
        onClick={() => click ? click( displayValue ) : null}
        onMouseEnter={( event ) => this.mouseEnter( event )}
        onTouchStart={( event ) => this.mouseEnter( event )}
        onMouseMove={( event ) => this.mouseMove( event )}
        onTouchMove={( event ) => this.mouseMove( event )}
        onMouseLeave={( event ) => this.mouseLeave( event )}
        onTouchEnd={( event ) => this.mouseLeave( event )}
      >
        <div style={{ width: mouseX }} className={styles.dialFill}/>
        <div className={styles.value}>{children ? children( displayValue ) : displayValue }</div>
      </div>
    )
  }
}
