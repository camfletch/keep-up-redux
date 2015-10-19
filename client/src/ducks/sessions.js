import request from 'superagent'
import { pushState } from 'redux-router'
import Immutable from 'immutable'

// CONSTANTS
const FETCHING = 'sessions/FETCHING'
const FETCHED = 'sessions/FETCHED'

const CREATING   = 'sessions/CREATING'
const CREATED   = 'sessions/CREATED'

const SAVING = 'sessions/SAVING'
const UPDATED  = 'sessions/UPDATED'
const DELETED  = 'sessions/DELETED'

const UPDATE_FORM = 'sessions/UPDATE_FORM'
const RESET_FORM = 'sessions/RESET_FORM'

const TOGGLE_CLIENT = 'sessions/TOGGLE_CLIENT'
const TOGGLE_EXERCISE = 'sessions/TOGGLE_EXERCISE'

// INITIAL STATE
const initialState = Immutable.fromJS({
  entities: {},
  syncing: {},
  isFetching: false,
  form: {
    _id: '',
    time: '',
    notes: '',
    clients: {},
    exercises: {}
  }
})

// ACTIONS
export function fetching() {
  return {
    type: FETCHING
  }
}

export function fetched(sessions) {
  return {
    type: FETCHED,
    sessions
  }
}

export function creating() {
  return {
    type: CREATING
  }
}

export function created(session) {
  return {
    type: CREATED,
    session
  }
}

export function saving(id) {
  return {
    type: SAVING,
    id: id
  }
}


export function updated(session) {
  return {
    type: UPDATED,
    session
  }
}

export function deleted(id) {
  return {
    type: DELETED,
    id
  }
}

export function updateForm(field, value) {
  return {
    type: UPDATE_FORM,
    field,
    value
  }
}

export function resetForm(id) {
  return {
    type: RESET_FORM,
    id
  }
}

export function toggleClient(id) {
  return {
    type: TOGGLE_CLIENT,
    id
  }
}

export function toggleExercise(id) {
  return {
    type: TOGGLE_EXERCISE,
    id
  }
}

// NAVIGATION ACTIONS
export function navToViewSessions() {
  return (dispatch) => {
    dispatch(pushState(null, '/sessions'))
  }
}

export function navToCreateSession() {
  return (dispatch) => {
    dispatch(resetForm())
    dispatch(pushState(null, '/sessions/new'))
  }
}

export function navToEditSession(id) {
  return (dispatch) => {
    dispatch(resetForm(id))
    dispatch(pushState(null, '/sessions/' + id))
  }
}

// ASYNC ACTIONS
export function fetchAsync() {
  return (dispatch) => {
    dispatch(fetching())

    request.get('/api/sessions').end((err, res) => {
      dispatch(fetched(res.body))
    })
  }
}

export function saveAsync(session) {
  return (dispatch) => {
    // convert clients / exercises map back into simple arrays
    session = denormalize(session)

    if (session._id) {
      dispatch(saving(session._id))

      // update
      request.put('/api/sessions').send(session).end((err, res) => {
        if (!err && res.ok) {
          dispatch(updated(res.body))
        }
      })

    } else {
      dispatch(creating())

      // create
      request.post('/api/sessions').send(session).end((err, res) => {
        if (!err && res.ok) {
          dispatch(created(res.body))
        }
      })
    }

    // clear the form
    dispatch(resetForm())

    // navigate back to view (new/updated model will be marked)
    dispatch(navToViewSessions())
  }
}

export function deleteAsync(id) {
  return (dispatch) => {
    dispatch(saving(id))

    request.del('/api/sessions/' + id).end((err, res) => {
      if (!err && res.ok) {
        dispatch(deleted(id))
      }
    })
  }
}

function normalize(session) {
  let clients = {}
  session.clients.forEach(id => {
    clients[id] = true
  })

  let exercises = {}
  session.exercises.forEach(id => {
    exercises[id] = true
  })

  return {...session, clients, exercises}
}

function denormalize(session) {
  let clients = Object.keys(session.clients)
  let exercises = Object.keys(session.exercises)

  return {...session, clients, exercises}
}

// REDUCER
export function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHING:
      state = state.set('isFetching', true)
      return state

    case FETCHED:
      // convert fetched sessions to a map by ids
      let indexed = {}
      action.sessions.forEach(s => {
        indexed[s._id] = normalize(s)
      })
      indexed = Immutable.fromJS(indexed)
      state = state.set('entities', indexed)
      state = state.set('isFetching', false)
      return state



    case CREATING:
      state = state.set('isFetching', true)
      return state

    case CREATED:
      let newSession = Immutable.fromJS(normalize(action.session))
      state = state.setIn(['entities', newSession.get('_id')], newSession)
      state = state.set('isFetching', false)
      return state

    case SAVING:
      state = state.setIn(['syncing', action.id], true)
      return state

    case UPDATED:
      let updatedSession = Immutable.fromJS(normalize(action.session))
      state = state.setIn(['entities', updatedSession.get('_id')], updatedSession)
      state = state.deleteIn(['syncing', updatedSession.get('_id')])
      return state

    case DELETED:
      state = state.deleteIn(['entities', action.id])
      state = state.deleteIn(['syncing', action.id])
      return state

    case UPDATE_FORM:
      state = state.setIn(['form', action.field], action.value)
      return state

    case RESET_FORM:
      if (action.id) {
        // set initial form state to be id's entity
        state = state.mergeIn(['form'], state.getIn(['entities', action.id]))
      } else {
        // set form state as it's initial state
        state = state.set('form', initialState.get('form'))
      }
      return state

    case TOGGLE_CLIENT:
      if (state.getIn(['form', 'clients', action.id])) {
        // if the id exists in clients, remove it
        state = state.deleteIn(['form', 'clients', action.id])
      } else {
        // if it doesn't exist, add it
        state = state.setIn(['form', 'clients', action.id], true)
      }
      return state

    case TOGGLE_EXERCISE:
      if (state.getIn(['form', 'exercises', action.id])) {
        // if the id exists in clients, remove it
        state = state.deleteIn(['form', 'exercises', action.id])
      } else {
        // if it doesn't exist, add it
        state = state.setIn(['form', 'exercises', action.id], true)
      }
      return state

    default:
      return state
  }
}
