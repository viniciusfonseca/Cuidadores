import presets from './QueryPresets'

import SQLite from 'react-native-sqlite-storage'
import Q from 'q'

import { Alert } from 'react-native'

import { noop } from '../App'

const isUndefined = any => typeof any === 'undefined'

SQLite.DEBUG(true)
SQLite.enablePromise(true)

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
        let res = null
        try {
            dbPtr = await SQLite.openDatabase(Database.DB_OPEN_OPTIONS)
            await dbPtr.executeSql(`PRAGMA foreign_keys = ON;`)
            this._dbPtr = dbPtr
        }
        catch (e) {
            throw e
        }
    }

    run = async sql => {
        try {
            // Alert.alert("query",q)
            let [qResult] = await this._dbPtr.executeSql(sql)
            let rows = []
            for (let i = 0; i < qResult.rows.length; i++) {
                rows.push(qResult.rows.item(i))
            }
            return new DatabaseResult(DatabaseResult.STATUS.OK, rows)
        }
        catch (e) {
            // Alert.alert("ERR", e.message)
            throw new DatabaseResult(DatabaseResult.STATUS.QUERY_ERROR, e)
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
        q = q.replace(/<\w+>/g, sub => {
            sub = sub.replace(/^<|>$/g, '')
            if (!params[sub]) {
                return '1'
            }
            if (!preset.filters) {
                return params[sub]
            }
            let filterCfg = preset.filters.find(filter => filter.name === sub)
            if (!filterCfg) {
                return params[sub]
            }
            let negateFlag = false
            let literalFlag = false
            if (filterCfg.flags) {
                negateFlag  = filterCfg.flags.includes("negate")
                literalFlag = filterCfg.flags.includes("literal")
            }
            if (isUndefined(params[sub]) || !(sub in params)) {
                if (literalFlag) return ""
                return !negateFlag ? '1' : '0'
            }
            return filterCfg.SQL ? filterCfg.SQL.replace(/<\?>/g, params[sub] || "") : params[sub]
        })
        return await this.run(q)
    }
}