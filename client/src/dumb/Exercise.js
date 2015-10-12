import React, { Component, PropTypes } from 'react'
import { ListGroupItem, Button, Glyphicon, ProgressBar } from 'react-bootstrap'

class Exercise extends Component {
  render() {
    const { name, editClicked, deleteClicked, disabled } = this.props
    return (
      <ListGroupItem>
        <div className='clearfix'>
          <span className='pull-left'>
            {name}
          </span>
          <span className='pull-right'>
            <Button bsStyle='primary' onClick={editClicked} disabled={disabled}>
              <Glyphicon glyph='edit' />
            </Button>
            <Button bsStyle='danger' onClick={deleteClicked} disabled={disabled} style={{marginLeft: '0.5em'}}>
              <Glyphicon glyph='trash' />
            </Button>
          </span>
        </div>
        { disabled ? <ProgressBar active bsStyle='success' now={100} style={{marginTop: '1em', marginBottom: '0em'}} /> : null }
      </ListGroupItem>
    )
  }
}

Exercise.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  editClicked: PropTypes.func.isRequired,
  deleteClicked: PropTypes.func.isRequired
}

export default Exercise