import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImmPropTypes from 'react-immutable-proptypes'
import shouldUpdatePure from '../util/shouldUpdatePure'
import { pushState } from 'redux-router'
import { fetchAsync, updateSearch } from '../ducks/clientsTemplates'
import SimpleList from '../dumb/SimpleList'
import FixedActionButton from '../dumb/FixedActionButton'

class ClientsTemplatesList extends Component {
  shouldComponentUpdate = shouldUpdatePure

  componentWillMount() {
    const props = this.props

    if (props.entities.size === 0) {
      props.fetchAsync()
    }
  }

  render() {
    const props = this.props
    return (
      <div>
        <SimpleList title='Clients Templates' items={props.entities} busyItems={props.syncing}
                    onItemClick={(id) => props.pushState({ title: 'Edit Clients Template' }, '/templates/clients/' + id)}
                    isBusy={props.isFetching} updateSearch={props.updateSearch} search={props.search}
                    getItemLetter={(template) => template.get('name').charAt(0).toUpperCase()}
                    getItemName={(template) => template.get('name')} />
        <FixedActionButton icon='add' onClick={() => props.pushState({ title: 'New Clients Template' }, '/templates/clients/new')}/>
      </div>
    )
  }
}

ClientsTemplatesList.propTypes = {
  // entities is an immutable list of immutable clients
  entities: ImmPropTypes.mapOf(
    ImmPropTypes.contains({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  syncing: ImmPropTypes.map.isRequired,
  fetchAsync: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  updateSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired
}

export default connect(
  state => {
    return {
      entities: state.clientsTemplates.get('entities'),
      isFetching: state.clientsTemplates.get('isFetching'),
      syncing: state.clientsTemplates.get('syncing'),
      search: state.clientsTemplates.get('search')
    }
  },
  dispatch => {
    return bindActionCreators({ fetchAsync, pushState, updateSearch }, dispatch)
  }
)(ClientsTemplatesList)
