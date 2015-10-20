import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImmPropTypes from 'react-immutable-proptypes'
import shouldUpdatePure from 'react-pure-render/function'
import { fetchAsync, navToEditSession } from '../ducks/sessions'
import SimpleList from '../dumb/SimpleList'

class SessionsList extends Component {
  shouldComponentUpdate = shouldUpdatePure

  componentWillMount() {
    const { entities, fetchAsync } = this.props

    if (entities.size == 0) {
      fetchAsync()
    }
  }

  render() {
    const { entities, syncing, navToEditSession, isFetching } = this.props
    return(
      <SimpleList title='Sessions' items={entities} busyItems={syncing} onItemClick={navToEditSession}
                  isBusy={isFetching}
                  getItemLetter={(session) => null}
                  getItemName={(session) => session.get('time')} />
    )
  }
}

SessionsList.propTypes = {
  // entities is an immutable list of immutable sessions
  entities: ImmPropTypes.mapOf(
                ImmPropTypes.contains({
                  _id: PropTypes.string.isRequired,
                  firstName: PropTypes.string.isRequired,
                  lastName: PropTypes.string.isRequired,
                })
              ),
  syncing: ImmPropTypes.map.isRequired,
  fetchAsync: PropTypes.func.isRequired,
  navToEditSession: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default connect(
  state => {
    return {
      entities: state.sessions.get('entities'),
      isFetching: state.sessions.get('isFetching'),
      syncing: state.sessions.get('syncing')
    }
  },
  dispatch => {
    return bindActionCreators({ fetchAsync, navToEditSession}, dispatch)
  }
)(SessionsList)
