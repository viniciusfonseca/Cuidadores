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

/* -- location -- */
export const NAVIGATE = 'NAVIGATE'
export const PossibleRoutes = {
    BACK: 'BACK',
    INIT: 'INIT',
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    HOME_: 'HOME',
    HOME: {
        SEARCH: 'HOME.SEARCH',
        PROFILE: 'HOME.PROFILE'
    }
}
export function navigateTo(location, params = {}) {
    return {
        type: NAVIGATE,
        name: location,
        params,
        lastNav: +new Date()
    }
}

/* -- db */
export const DB_ASSIGN = 'DB_ASSIGN'
export function assignDB(db) {
    return {
        type: DB_ASSIGN,
        db
    }
}

/* -- */
export const USER_UPDATE = 'USER_UPDATE'
export function updateUserData(fields) {
    return {
        type: USER_UPDATE,
        fields
    }
}