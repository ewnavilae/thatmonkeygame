import React, { Component } from "react"
import { Map, List } from "immutable"

export const spring = ""

export default options => {
  return WrappedClass => class Notifier extends Component {

    state = {
      notifications: new Map(),
    }

    addNotification ( index, notification ) {
      const { notifications } = this.state
      this.setState( {
        notifications: notifications.update( index, new List(), thisNotifications =>
          thisNotifications.unshift( notification )
        ),
      } )
    }

    removeNotification ( index, notification ) {
      const { notifications } = this.state
      const notificationIndex = notifications.get( index ).indexOf( notification )
      this.setState( {
        notifications: notifications.update( index, thisNotifications =>
          thisNotifications.delete( notificationIndex )
        ),
      } )
    }

    notify ( index, notification, addBit, removeBit ) {
      setTimeout( () => {
        this.addNotification( index, notification )
        setTimeout( () => {
          this.removeNotification( index, notification )
        }, removeBit )
      }, addBit )
    }

    render () {
      const { notifications } = this.state
      return (
        <WrappedClass
          {...this.props}
          notifications={notifications}
          addNotification={( index, notification ) => this.addNotification( index, notification )}
          removeNotification={( index, notification ) => this.removeNotification( index, notification )}
          notify={( index, notification, addBit, removeBit ) => this.notify( index, notification, addBit, removeBit )}
        />
      )
    }

  }
}
