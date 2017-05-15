import { AsyncStorage } from 'react-native'
import { $timeout } from './Utils'
import { PRESETS_ID } from './QueryPresets.js'
import { initialState } from '../Reducers'

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

    static get INITIAL_STATE() {
        return {
            Tipo: 0,
            Nome: '',
            CPF: '',
            DataNascimento: '',
            Estado: '',
            Cidade: '',
            Telefone: '',
            Email: '',
            Senha: ''
        }
    }

    _status = User.STATUS.NOT_INITIATED
    db = null

    fields = User.INITIAL_STATE

    constructor(db) { this.db = db }

    getStatus() { return this._status }

    init = async() => {
        try {
            let id = await AsyncStorage.getItem('CodigoUsuario')
            if (!id) {
                this._status = User.STATUS.INITIATED_NULL
            }
            else {
                this._status = User.STATUS.INITIATED_FILLED
                return await this.load()
            }
        } catch(e) {
            this._status = User.INIT_ERROR
            throw new UserStorageError("Error initializing user structure.")
        }
    }

    load = async() => {
        let userPtr = {}
        let keys = Object.keys(this.fields)
        (await Promise.all(
            keys.map(key => AsyncStorage.getItem(key))
        )).forEach((value, index) => {
            userPtr[keys[index]] = value[index]
        })
        this.fields = userPtr
    }

    write = async data => {
        let asyncOperations = []
        Object.keys(data).filter(key => !!key && key in this.fields).forEach(key => {
            this.fields[key] = data[key]
            asyncOperations.push(AsyncStorage.setItem(key, data[key].toString()))
        })
        return await Promise.all(asyncOperations)
    }

    reset = async() => { await this.write(User.INITIAL_STATE) }

    authenticate = async(login, pass) => {
        let res = null
        let isAuth = false
        let userData = null
        try {
            res = await this.db.fetchData(PRESETS_ID.AUTHENTICATION, {
                email: login,
                pass
            })
            isAuth = !!(res && res.rows && res.rows.length && res.rows[0].R)
        }
        catch (e) {
            throw e
        }
        if (!isAuth) return false
        try {
            userData = (await this.db.fetchData(PRESETS_ID.RETRIEVE_USER, {
                email: login,
                pass
            }))[0]
            await this.write(userData)
            return true
        } catch (e) {
            throw e
        }
    }
}