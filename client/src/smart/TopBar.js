import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import shouldUpdatePure from 'react-pure-render/function'
import { AppBar, LeftNav } from 'material-ui'
import { pushState } from 'redux-router'

class TopBar extends Component {
  shouldComponentUpdate = shouldUpdatePure

  toggleMenu() {
    this.refs.leftNav.toggle()
  }

  render() {
    const menuItems = [
      {route: '/clients', text: 'Clients'},
      {route: '/exercises', text: 'Exercises'},
      {route: '/sessions', text: 'Sessions'},
    ]

    const { children, pushState } = this.props

    return (
      <div>
        <AppBar style={{position: 'fixed'}} title='Keep Up' zDepth={1} onLeftIconButtonTouchTap={() => this.refs.leftNav.toggle()}/>
        <LeftNav ref='leftNav' menuItems={menuItems} docked={false} onChange={(e, k, p) => pushState(null, p.route)}/>
        <div style={{paddingTop: '4.5em', display: 'flex', justifyContent: 'center', alignItems: 'stretch'}}>
          <div style={{flex: '1', display: 'flex', minWidth: '15em', maxWidth: '50em', flexDirection: 'column', margin: '0.5em'}}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

TopBar.PropTypes = {
  pushState: PropTypes.func.isRequired,
}

export default connect(
  state => {
    return {}
  },
  dispatch => {
    return bindActionCreators({ pushState }, dispatch)
  }
)(TopBar)
