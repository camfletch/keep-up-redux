import Immutable from 'immutable'
import { fetchAsync as fetchSessionsAsync } from './sessions'

// CONSTANTS
const SHOW_MESSAGE = 'global/SHOW_MESSAGE'
const HIDE_MESSAGE = 'global/HIDE_MESSAGE'
const UPDATE_DATE = 'global/UPDATE_DATE'

// INITIAL STATE
const initialState = Immutable.fromJS({
  message: '',
  startDate: null,
  endDate: null
})

// ACTIONS
export function showMessage(message) {
  return {
    type: SHOW_MESSAGE,
    message
  }
}

export function hideMessage() {
  return {
    type: HIDE_MESSAGE
  }
}

export function updateDate(field, value) {
  return {
    type: UPDATE_DATE,
    field,
    value
  }
}

export function updateDateAsync(field, value) {
  return (dispatch, getState) => {
    dispatch(updateDate(field, value))
    const start = getState().global.get('startDate')
    const end = getState().global.get('endDate')
    console.log('fetching start: ', start)
    console.log('end: ', end)
    dispatch(fetchSessionsAsync(start, end))
  }
}

// REDUCER
export function reducer(state = initialState, action) {
  switch (action.type) {
  case SHOW_MESSAGE:
    state = state.set('message', action.message)
    return state

  case HIDE_MESSAGE:
    state = state.set('message', '')
    return state

  case UPDATE_DATE:
    if (action.field === 'start' || action.field === 'startDate') {
      state = state.set('startDate', action.value)
    } else if (action.field === 'end' || action.field === 'endDate') {
      state = state.set('endDate', action.value)
    }
    return state

  default:
    return state
  }
}
