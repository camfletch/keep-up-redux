import React, { PropTypes } from 'react'
import ImmPropTypes from 'react-immutable-proptypes'
import { List, Paper, ListDivider, TextField } from 'material-ui'
import SimpleListItem from './SimpleListItem'
import CenteredSpinner from './CenteredSpinner'
import IconInputContainer from './IconInputContainer'

function renderItems(items, busyItems, onItemClick, getItemLetter, getItemName, search) {
  let lastLetter = ''
  return items.toOrderedSet().map(item => {
    const id = item.get('_id')
    const name = getItemName(item)

    if (name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
      return null
    }

    // if busyItems is true at the id, that item is busy
    const busy = busyItems.get(id) ? true : false

    // determine whether this item should have a left letter icon using the callback
    let letter = getItemLetter(item)
    if (letter && letter !== lastLetter) {
      lastLetter = letter
    } else {
      letter = null
    }

    return (
      <SimpleListItem key={id} name={name} busy={busy}
                      editClicked={() => onItemClick(id)}
                      letter={letter}/>
    )
  })
}

function renderHeader(title, search, updateSearch) {
  return (
    <div style={{ paddingLeft: '0.3em', paddingRight: '1em' }}>
      <IconInputContainer icon='search'>
        <TextField style={{ width: '100%' }} floatingLabelText={'Search ' + title} value={search} onChange={(ev) => updateSearch(ev.target.value)} />
      </IconInputContainer>
    </div>
  )
}

const SimpleList = ({ isBusy, title, search, updateSearch, items, busyItems, onItemClick, getItemLetter, getItemName }) => {
  return (
    <Paper zDepth={2}>
      <List subheader={renderHeader(title, search, updateSearch)} subheaderStyle={{ fontSize: '1em' }}>
        <ListDivider />
        <CenteredSpinner isVisible={isBusy} />
        {renderItems(items, busyItems, onItemClick, getItemLetter, getItemName, search)}
      </List>
    </Paper>
  )
}

SimpleList.propTypes = {
  title: PropTypes.string.isRequired,
  items: ImmPropTypes.mapOf(                    // items map
                ImmPropTypes.contains({
                  _id: PropTypes.string.isRequired
                })
              ),
  busyItems: ImmPropTypes.map.isRequired,       // busy map of {id -> true} if the item is busy
  onItemClick: PropTypes.func.isRequired,       // callback for item click
  isBusy: PropTypes.bool.isRequired,            // global isBusy for the whole list
  getItemLetter: PropTypes.func.isRequired,     // (entity) => letter function
  getItemName: PropTypes.func.isRequired,       // (entity) => name function
  search: PropTypes.string.isRequired,      // the currently active search text,
  updateSearch: PropTypes.func.isRequired       // callback for search updating
}

export default SimpleList
