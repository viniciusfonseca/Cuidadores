import * as Actions from './Actions'
import { combineReducers } from 'redux'

const initialState = {
    location: {},
    user: {},
    db: {}
}

export function location(state = initialState.location, action) {
    switch (action.type) {
        case Actions.NAVIGATE:
            return Object.assign({}, state, action)
        default:
            return state
    }
}

export function user(state = initialState.user, action) {
    switch (action.type) {
        case Actions.USER:
            return Object.assign({}, state, action.fields)
        default:
            return state
    }
}

const appCombinedReducers = combineReducers({
    location,
    user
})

export default appCombinedReducers