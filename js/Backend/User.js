import { AsyncStorage } from 'react-native'

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

    init = async() => {
        try {
            let id = await AsyncStorage.getItem('id')
            if (id !== null) {
                _status = User.STATUS.INITIATED_FILLED
            }
            else {
                _status = User.STATUS.INITIATED_NULL
            }
        } catch(e) {
            _status = User.INIT_ERROR
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

    write = async(data) => {
        let asyncOperations = []
        Object.keys(data).filter(key => !!key && key in this.fields).forEach(key => {
            asyncOperations.push(AsyncStorage.setItem(key, data[key].toString()))
        })
        return await Promise.all(asyncOperations)
    }
}