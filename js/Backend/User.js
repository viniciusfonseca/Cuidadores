import { AsyncStorage } from 'react-native'
import { $timeout } from './Utils'

class UserStorageError extends Error {}

export default class User {
    static get STATUS() {
        return {
            NOT_INITIATED:    0x00,
            INIT_ERROR:       0x01,
            INITIATED_NULL:   0x02,
            INITIATED_FILLED: 0x03
        }
    }

    static get USER_TYPE() {
        return {
            CUIDADOR:    0x00,
            RESPONSAVEL: 0x01
        }
    }

    _status = User.STATUS.NOT_INITIATED
    db = null

    fields = {
        id:       "",
        email:    "",
        type:     "",
        name:     "",
        birthday: "",
        state:    "",
        city:     "",
        phone:    ""
    }

    constructor(db) { this.db = db }

    init = async() => {
        try {
            let id = await AsyncStorage.getItem('id')
            if (id !== null) {
                this._status = User.STATUS.INITIATED_FILLED
            }
            else {
                this._status = User.STATUS.INITIATED_NULL
            }
        } catch(e) {
            this._status = User.INIT_ERROR
            throw new UserStorageError("Error initializing user structure.")
        }
    }

    load = async() => {
        let userPtr = {}
        let keys = Object.keys(this.fields)
        await Promise.all(
            keys.map(key => AsyncStorage.getItem(key))
        ).forEach((value, index) => {
            userPtr[keys[index]] = value[index]
        })
        return userPtr
    }

    write = async data => {
        let asyncOperations = []
        Object.keys(data).filter(key => !!key && key in this.fields).forEach(key => {
            asyncOperations.push(AsyncStorage.setItem(key, data[key].toString()))
        })
        return await Promise.all(asyncOperations)
    }

    authenticate = async(login, pass) => {
        let res = null
        try {
            res = await this.db.fetchData('authentication', {
                email: login, pass
            })
            await $timeout(2500)
            return !!(res && res.rows && res.rows.length && res.rows[0].R)
        } catch (e) {
            throw e
        }
    }
}