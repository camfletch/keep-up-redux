import React, { Component, PropTypes } from 'react'
import shouldUpdatePure from 'react-pure-render/function'
import { ListItem, Avatar, Styles, LinearProgress } from 'material-ui'

class SimpleListItem extends Component {
  shouldComponentUpdate = shouldUpdatePure

  renderProgress() {
    return (
      <div style={{ padding: '1em' }}>
        <LinearProgress mode='indeterminate'/>
      </div>
    )
  }

  render() {
    const { name, editClicked, busy, letter } = this.props

    return (
      <div>
        <ListItem primaryText={name}
                  leftAvatar={letter ? <Avatar color={Styles.Colors.pinkA200} backgroundColor={Styles.Colors.cyanA100}>{letter}</Avatar> : null}
                  onClick={editClicked} disabled={busy} insetChildren={true}/>
        {busy ? this.renderProgress() : null}
      </div>
    )
  }
}

SimpleListItem.propTypes = {
  name: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  editClicked: PropTypes.func.isRequired,
  letter: PropTypes.string
}

export default SimpleListItem
