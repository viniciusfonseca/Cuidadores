import * as Actions from './Actions'
import { combineReducers } from 'react-redux'

const initialState = {
    location: Actions.PossibleRoutes.INIT,
    params: {},
    user: {},
    db: {}
}

export default function navReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.NAVIGATE:
            return Object.assign({}, state, {
                location: action.location,
                params: action.params
            })
        default:
            return state
    }
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.USER:
            return Object.assign({}, state, action.fields)
        default:
            return state
    }
}

export const appCombinedReducers = combineReducers({
    navReducer,
    userReducer
})