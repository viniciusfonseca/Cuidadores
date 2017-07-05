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
            RESPONSAVEL: 0x00,
            CUIDADOR:    0x01
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
    __specBind__ = null

    fields = User.INITIAL_STATE

    constructor(db) { this.db = db }

    getStatus() { return this._status }
    setDB(db) { this.db = db }

    init = async() => {
        try {
            let email = await AsyncStorage.getItem('Email')
            let pass = null
            if (!email) {
                this._status = User.STATUS.INITIATED_NULL
            }
            else {
                this._status = User.STATUS.INITIATED_FILLED
                pass = await AsyncStorage.getItem('Senha')
                return await this.authenticate(email, pass)
            }
        } catch(e) {
            this._status = User.STATUS.INIT_ERROR
            throw new UserStorageError("Error initializing user structure: " + e.message)
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
        // Alert.alert("load",JSON.stringify(userData))
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
            // Alert.alert("data", JSON.stringify(userData))
            this.setCodigoUsuario( userData.CodigoUsuario )
            await this.write(userData)
            this.selfDecorate()
            return true
        } catch (e) {
            throw e
        }
    }

    getCodigoUsuario() { return this.fields.CodigoUsuario }
    setCodigoUsuario( c ) { this.fields.CodigoUsuario = c }

    selfDecorate() {
        if (typeof this.__specBind__ == "number") {
            return
        }
        switch (this.fields.Tipo) {
            case User.USER_TYPE.RESPONSAVEL:
                return ResponsavelDecorator(this)
            case User.USER_TYPE.CUIDADOR:
                return CuidadorDecorator(this)
            default:
                return this
        }
    }
    
    static Contratos = {
        Actions: {
            ACEITAR:  'ACEITAR',
            RECUSAR:  'RECUSAR',
            CANCELAR: 'CANCELAR'
        },
        Status: {
            PENDENTE_CUIDADOR: "PENDENTE_CUIDADOR",
            PENDENTE_RESPONSAVEL: "PENDENTE_RESPONSAVEL",
            ACEITO: "ACEITO",
            CANCELADO: "CANCELADO"
        },
        async Novo(db, { CodigoUsuarioCuidador, CodigoDependente, Requerente }) {
            return await db.run(`INSERT INTO CONTRATO (CodigoUsuarioCuidador, CodigoDependente, Status)
                VALUES (${CodigoUsuarioCuidador},${CodigoDependente},"${Requerente}");`)
        },
        async Aceitar(db, { CodigoContrato }) {
            return await db.run(`UPDATE CONTRATO SET Status="${User.Contratos.Status.ACEITO}";`)
        },
        async CancelarRejeitar(db, { CodigoContrato }) {
            return await db.run(`UPDATE CONTRATO SET Status="${User.Contratos.Status.CANCELADO}"`)
        }
    }
}

const getDiffsRegistros = (registrosA, registrosB, nomeChave) => {
    let kA, kB
    let diffs = []

    registrosA.forEach(r => r[nomeChave] = r[nomeChave] || -1)

    const sortR = (pA, pB) => {
        if (pA[ nomeChave ] <  pB[ nomeChave ]) return -1
        if (pA[ nomeChave ] == pB[ nomeChave ]) return 0
        return 1
    }

    registrosA = (registrosA || []).slice().sort(sortR)
    registrosB = (registrosB || []).slice().sort(sortR)

    let cA = registrosA.map(p => [ p[ nomeChave ], p ])
    let cB = registrosB.map(p => [ p[ nomeChave ], p ])

    const avancaA = () => kA = (cA.shift() || [ Infinity, null ])
    const avancaB = () => kB = (cB.shift() || [ Infinity, null ])

    avancaA()
    avancaB()

    if (kA[0] == Infinity && kB[0] == Infinity) {
        return diffs
    }

    do {
        if (kB[0] == -1 || kA[0] > kB[0]) {
            diffs.push([ 'I', kB[0], kB[1] ])
            avancaB()
        }
        else if (kA[0] == kB[0]) {
            diffs.push([ 'U', kA[0], kB[1] ])
            avancaA()
            avancaB()
        }
        else {
            diffs.push([ 'D', kA[0], kA[1] ])
            avancaA()
        }
    } while (kA[0] != Infinity || kB[0] != Infinity)

    return diffs
}

export function ResponsavelDecorator( userContext ) {
    userContext.__specBind__ = User.USER_TYPE.RESPONSAVEL

    userContext.obterDependentes = async() => {
        return (await userContext.db.fetchData(PRESETS_ID.DEPENDENTES, {
            CodigoUsuario: userContext.getCodigoUsuario()
        })).rows
    }

    userContext.criarDependente = async({ NomeDependente, Observacoes, Prescricoes = [] }) => {
        await userContext.db.fetchData(PRESETS_ID.CREATE_DEPENDENTE, {
            CodigoUsuario: userContext.getCodigoUsuario(), NomeDependente, Observacoes: Observacoes || ""
        })
        if (Prescricoes.length) {
            // Alert.alert("Prescricoes", JSON.stringify(Prescricoes))
            let { CodigoDependente } = (await userContext.db.run("SELECT MAX(CodigoDependente) AS CodigoDependente FROM DEPENDENTE;")).rows.shift()
            return Prescricoes.map(Prescricao => async() => {
                await userContext.db.run(`INSERT INTO PRESCRICAO (
                    NomeMedico, CRM, CodigoDependente, DataPrescricao
                ) VALUES (
                    '${Prescricao.NomeMedico || ""}',
                    '${Prescricao.CRM || ""}',
                    ${CodigoDependente},
                    '${Prescricao.DataPrescricao || ""}'
                );`)
                let { CodigoPrescricao } = (await userContext.db.run("SELECT MAX(CodigoPrescricao) AS CodigoPrescricao FROM PRESCRICAO;")).rows.shift()
                let batchSQL = Prescricao.Procedimentos.map(Procedimento => `INSERT INTO PROCEDIMENTO (
                    DescricaoProcedimento, CodigoPrescricao, FrequenciaDia, DuracaoDias
                ) VALUES (
                    '${Procedimento.DescricaoProcedimento || ""}',
                    ${CodigoPrescricao},
                    ${Procedimento.FrequenciaDia || "0"},
                    ${Procedimento.DuracaoDias || "0"}
                );`)
                await Promise.all( batchSQL.map(sql => userContext.db.run(sql)) )
            }).reduce((ps, p) => ps.then(p), Promise.resolve())
        }
        return await userContext.obterDependentes()
    }

    userContext.atualizarDependente = async({
        CodigoDependente,
        NomeDependente,
        Observacoes,
        Prescricoes
    }, prescricoesAnteriores) => {
        const diffsPrescricoes = getDiffsRegistros(prescricoesAnteriores, Prescricoes, 'CodigoPrescricao')
        let batchSQLPrescricoes = diffsPrescricoes.map(([ op, CodigoPrescricao, Prescricao ]) => {
            switch (op) {
                case 'I':
                    return `INSERT INTO PRESCRICAO (
                        NomeMedico, CRM, DataPrescricao, CodigoDependente
                    ) VALUES (
                        '${Prescricao.NomeMedico}',
                        '${Prescricao.CRM}',
                        '${Prescricao.DataPrescricao}',
                        ${CodigoDependente}
                    );`
                case 'U':
                    return `UPDATE PRESCRICAO SET
                        NomeMedico='${Prescricao.NomeMedico}',
                        CRM='${Prescricao.CRM}',
                        DataPrescricao='${Prescricao.DataPrescricao}'
                        WHERE PRESCRICAO.CodigoPrescricao=${CodigoPrescricao};`
                case 'D':
                    return `DELETE FROM PRESCRICAO 
                        WHERE PRESCRICAO.CodigoPrescricao=${CodigoPrescricao};`
                default:
                    return ""
            }
        })
        await userContext.db.fetchData(PRESETS_ID.UPDATE_DEPENDENTE, {
            CodigoDependente,
            NomeDependente,
            Observacoes
        })
        await Promise.all(
            batchSQLPrescricoes.map(sql => userContext.db.run( sql ))
        )

        const diffsProcedimentos = getDiffsRegistros(
            [].concat.apply([], prescricoesAnteriores.map(Prescricao => Prescricao.Procedimentos || [])),
            [].concat.apply([], Prescricoes.map(Prescricao => Prescricao.Procedimentos || [])),
            'CodigoProcedimento'
        )
        let batchSQLProcedimentos = diffsProcedimentos.map(([op, CodigoProcedimento, Procedimento]) => {
            switch (op) {
                case 'I':
                    return `INSERT INTO PROCEDIMENTO (
                        DescricaoProcedimento, CodigoPrescricao, FrequenciaDia, DuracaoDias
                    ) VALUES (
                        '${Procedimento.DescricaoProcedimento}',
                        ${Procedimento.CodigoPrescricao},
                        ${Procedimento.FrequenciaDia},
                        ${Procedimento.DuracaoDias}
                    );`
                case 'U':
                    return `UPDATE PROCEDIMENTO SET
                        DescricaoProcedimento='${Procedimento.DescricaoProcedimento}',
                        FrequenciaDia=${Procedimento.FrequenciaDia},
                        DuracaoDias=${Procedimento.DuracaoDias}
                        WHERE PROCEDIMENTO.CodigoProcedimento=${CodigoProcedimento};`
                case 'D':
                    return `DELETE FROM PROCEDIMENTO 
                        WHERE PROCEDIMENTO.CodigoProcedimento=${CodigoProcedimento};`
                default:
                    return ""
            }
        })
        await Promise.all(
            batchSQLProcedimentos.map(sql => userContext.db.run(sql))
        )
        return await userContext.obterDependentes()
    }

    userContext.apagarDependente = async({
        CodigoDependente
    }) => {
        await userContext.db.fetchData(PRESETS_ID.DELETE_DEPENDENTE, {
            CodigoDependente
        })
        return await userContext.obterDependentes()
    }
    return userContext
}

export function CuidadorDecorator( userContext ) {

    userContext.__specBind__ = User.USER_TYPE.CUIDADOR

    userContext.adicionarEspecialidade = async({
        CodigoEspecialidade
    }) => {
        return await userContext.db.fetchData(PRESETS_ID.ADD_ESPECIALIDADE, Object.assign({
            CodigoUsuario: userContext.getCodigoUsuario(),
            CodigoEspecialidade
        }))
    }

    userContext.removerEspecialidade = async({
        CodigoEspecialidade
    }) => {
        return await userContext.db.fetchData(PRESETS_ID.REMOVE_ESPECIALIDADE, Object.assign({
            CodigoUsuario: userContext.getCodigoUsuario(),
            CodigoEspecialidade
        }))
    }

    userContext.registrarExecucao = async({
        CodigoProcedimento, DataExecucao, HoraExecucao,
        Comentarios, DescricaoProcedimento
    }) => {
        return await userContext.db.run(`INSERT INTO EXECUCAO (CodigoProcedimento, DataExecucao, HoraExecucao, Comentarios, DescricaoProcedimento)
            VALUES (${CodigoProcedimento},"${DataExecucao}","${HoraExecucao}","${Comentarios}","${DescricaoProcedimento}");`)
    }

    return userContext
}