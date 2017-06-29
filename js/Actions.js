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
        PROFILE: 'HOME.PROFILE',
        PROCEDURES: 'HOME.PROCEDURES'
    },
    PROFILE_VIEW: 'PROFILE_VIEW'
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
export const USER_ASSIGN = 'USER_ASSIGN'
export function assignUser(user) {
    return {
        type: USER_ASSIGN,
        user
    }
}

/* -- */
export const NAVIGATION_ASSIGN = 'NAVIGATION_ASSIGN'
export function assignStackNavigation(navigation) {
    return {
        type: NAVIGATION_ASSIGN,
        navigation
    }
}