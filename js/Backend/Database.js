// @flow
import { presets } from './QueryPresets'

import SQLite from 'react-native-sqlite-storage'
SQLite.enablePromise(true)

import { Alert } from 'react-native'

export class DatabaseResult {
    static get STATUS() {
        return {
            OK:                   0x00,
            INVALID_QUERY_KEY:    0x01,
            EMPTY_QUERY_SQL_BASE: 0x02,
            QUERY_ERROR:          0x03
        }
    }
    status = DatabaseResult.STATUS.OK

    constructor(code, rows) {
        this.status = code
        this.rows = rows || []
    }
}
export default class Database {
    static get DB_OPEN_OPTIONS() {
        return {
            name: "db.db",
            createFromLocation: "~db.db"
        }
    }
    _dbPtr = null

    init = async() => {
        let dbPtr = null
        try {
            dbPtr = await SQLite.openDatabase(Database.DB_OPEN_OPTIONS)
            this._dbPtr = dbPtr
        } catch(e) {
            throw e
        }
    }

    fetchData = async(queryKey, params) => {
        let preset = presets.find(preset => preset.id === queryKey)
        if (!preset) {
            throw new DatabaseResult(DatabaseResult.STATUS.INVALID_QUERY_KEY)
        }
        let q = preset.base
        if (!q) {
            throw new DatabaseResult(DatabaseResult.STATUS.EMPTY_QUERY_SQL_BASE)
        }
        //Alert.alert('will replace', q)
        q = q.replace(/<\w+>/g, sub => {
            sub = sub.replace(/^<|>$/g, '')
            let filterCfg = preset.filters.find(filter => filter.name === sub)
            if (!filterCfg) {
                return '1'
            }
            let negateFlag = false
            if (filterCfg.flags) {
                negateFlag = filterCfg.flags.includes("negate")
            }
            if (!(sub in params)) {
                return !negateFlag ? '1' : '0'
            }
            return filterCfg.SQL.replace(/<\?>/g, params[sub] || "")
        })
        //Alert.alert('will query', q)
        try {
            let qResult = (await this._dbPtr.executeSql(q)).pop()
            let rows = []
            for (let i = 0; i < qResult.rows.length; i++) {
                rows.push(qResult.rows.item(i))
            }
            return new DatabaseResult(DatabaseResult.STATUS.OK, rows)
        } catch(e) {
            Alert.alert("ERR", e.message)
            throw new DatabaseResult(DatabaseResult.STATUS.QUERY_ERROR)
        }   
    }
}