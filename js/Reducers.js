import * as Actions from './Actions'
import { combineReducers } from 'redux'

export const initialState = {
    location: {},
    user: {},
    db: {},
    navigation: {}
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
        case Actions.USER_ASSIGN:
            return action.user
        default:
            return state
    }
}

export function db(state = initialState.db, action) {
    switch (action.type) {
        case Actions.DB_ASSIGN:
            return action.db
        default:
            return state
    }
}

export function navigation(state = initialState.navigation, action) {
    switch (action.type) {
        case Actions.NAVIGATION_ASSIGN:
            return action.navigation
        default:
            return state 
    }
}

const appCombinedReducers = combineReducers({
    location,
    user,
    db,
    navigation
})

export default appCombinedReducers