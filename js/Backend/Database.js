import * as fetchDataPresets from './QueryPresets'

import SQLite from 'react-native-sqlite-storage'
SQLite.enablePromise(true)

import { Alert } from 'react-native'

export default class Database {
    static get DB_OPEN_OPTIONS() {
        return {
            name: "db.db"
        }
    }
    _dbPtr = null

    init = async() => {
        SQLite.openDatabase(Database.DB_OPEN_OPTIONS).then(dbPtr => this._dbPtr = dbPtr)
    }

    performAuthentication = async(login, pass) => {
        let res = await this._dbPtr.executeSql(
            `SELECT EXISTS(
                SELECT 1 FROM USUARIO 
                WHERE USUARIO.Email = '${login}' 
                AND USUARIO.Senha = '${pass}')
            `)
    }

    fetchData = async(queryKey, params) => {

    }
}