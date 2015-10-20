import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImmPropTypes from 'react-immutable-proptypes'
import shouldUpdatePure from 'react-pure-render/function'
import { pushState } from 'redux-router'
import { fetchAsync } from '../ducks/clients'
import SimpleList from '../dumb/SimpleList'

class ClientsList extends Component {
  shouldComponentUpdate = shouldUpdatePure

  componentWillMount() {
    const { entities, fetchAsync } = this.props

    if (entities.size == 0) {
      fetchAsync()
    }
  }

  render() {
    const { entities, syncing, pushState, isFetching } = this.props
    return(
      <SimpleList title='Clients' items={entities} busyItems={syncing} onItemClick={(id) => pushState(null, '/clients/' + id)}
                  isBusy={isFetching}
                  getItemLetter={(client) => client.get('lastName').charAt(0).toUpperCase()}
                  getItemName={(client) => client.get('firstName') + ' ' + client.get('lastName')} />
    )
  }
}

ClientsList.propTypes = {
  // entities is an immutable list of immutable clients
  entities: ImmPropTypes.mapOf(
                ImmPropTypes.contains({
                  _id: PropTypes.string.isRequired,
                  firstName: PropTypes.string.isRequired,
                  lastName: PropTypes.string.isRequired,
                })
              ),
  syncing: ImmPropTypes.map.isRequired,
  fetchAsync: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default connect(
  state => {
    return {
      entities: state.clients.get('entities'),
      isFetching: state.clients.get('isFetching'),
      syncing: state.clients.get('syncing')
    }
  },
  dispatch => {
    return bindActionCreators({ fetchAsync, pushState}, dispatch)
  }
)(ClientsList)
