import { AsyncStorage, Alert } from 'react-native'
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
    setDB(db) { this.db = db }

    init = async() => {
        try {
            let id = await AsyncStorage.getItem('CodigoUsuario')
            Alert.alert("id",id)
            if (!id) {
                this._status = User.STATUS.INITIATED_NULL
            }
            else {
                this._status = User.STATUS.INITIATED_FILLED
                // Alert.alert("status",""+this._status)
                return await this.load()
            }
        } catch(e) {
            this._status = User.STATUS.INIT_ERROR
            throw new UserStorageError("Error initializing user structure.")
        }
    }

    load = async() => {
        let userData = {}
        let keys = Object.keys(this.fields)
        try {
            (await Promise.all(
                keys.map(key => AsyncStorage.getItem(key))
            )).forEach((value, index) => {
                userData[keys[index]] = value[index]
            })
        } catch (e) {
            throw new UserStorageError("Error retrieving internal storage data.")
        }
        Alert.alert("load",JSON.stringify(userData))
        this.fields = userData
    }

    write = async data => {
        try {
            let asyncOperations = []
            Object.keys(data).filter(key => !!key && key in this.fields).forEach(key => {
                this.fields[key] = data[key]
                asyncOperations.push(AsyncStorage.setItem(key, String(data[key])))
            })
            return await Promise.all(asyncOperations)
        } catch (e) {
            Alert.alert("ERR", JSON.stringify(e.message))
            throw e
        }
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
            })).rows[0]
            Alert.alert("data", JSON.stringify(userData))
            await this.write(userData)
            return true
        } catch (e) {
            throw e
        }
    }
}