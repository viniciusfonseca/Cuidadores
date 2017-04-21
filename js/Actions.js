/**
APP_STATE = {
    location: {
        name: #{string}
        params: #{object}
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
export default function navigateTo(location, params = {}) {
    return {
        type: NAVIGATE,
        location,
        params
    }
}

/* -- */
export const FETCH = 'FETCH'
export const REQUEST = 'REQUEST'
export const RECEIVE = 'RECEIVE'
export default function requestData(queryKey, params) {
    return {
        type: REQUEST,
        queryKey, params
    }
}
export default function receiveData(rows) {
    return {
        type: RECEIVE,
        rows
    }
}

export default function fetchData(queryKey, params) {
    return function(dispatch) {
        
    }
}

/* -- */
export const USER = 'USER'
export default function updateUserData(fields) {
    return {
        type: USER,
        fields
    }
}