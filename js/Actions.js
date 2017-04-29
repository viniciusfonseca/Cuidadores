/**
APP_STATE = {
    location: {
        name: #{string}
        params: #{object}
        lastNav: #{date}
    }
    user: #{object}
    db: {
        fetching: #{boolean}
        response: #{array__object}
    }
}
*/

/* -- */
export const NAVIGATE = 'NAVIGATE'
export const PossibleRoutes = {
    INIT: 'INIT',
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER'
}
export function navigateTo(location, params = {}) {
    return {
        type: NAVIGATE,
        name: location,
        params,
        lastNav: +new Date()
    }
}

/* -- */
export const FETCH = 'FETCH'
export const REQUEST = 'REQUEST'
export const RECEIVE = 'RECEIVE'
export function requestData(queryKey, params) {
    return {
        type: REQUEST,
        queryKey, params
    }
}
export function receiveData(rows) {
    return {
        type: RECEIVE,
        rows
    }
}

export function fetchData(queryKey, params) {
    return function(dispatch) {
        
    }
}

/* -- */
export const USER = 'USER'
export function updateUserData(fields) {
    return {
        type: USER,
        fields
    }
}