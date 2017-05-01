import * as Actions from './Actions'
import { combineReducers } from 'redux'

export const initialState = {
    location: {},
    user: {
        userService: null,
        tipo: 0,
        nome: '',
        cpf: '',
        datanasc: '',
        estado: '',
        cidade: '',
        telefone: '',
        email: '',
        senha: ''
    },
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
        case Actions.USER_UPDATE:
            return Object.assign({}, state, action.fields)
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

const appCombinedReducers = combineReducers({
    location,
    user,
    db
})

export default appCombinedReducers