import React from 'react'
import {
    View, ScrollView, Text, ActivityIndicator, TextInput, Alert
} from 'react-native'

import { connect } from 'react-redux'

import CheckBox from 'react-native-check-box'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import User from '../../Backend/User'
import { PRESETS_ID } from '../../Backend/QueryPresets'
import * as Actions from '../../Actions'

import NavBar from '../../Components/NavBar'
import SubHeader from '../../Components/SubHeader'
import ListItem from '../../Components/ListItem'
import ImprovedTouchable from '../../Components/ImprovedTouchable'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

class Procedures extends React.Component {

    tipoUsuario = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            index: 0,
            routes: (() => {
                switch (this.props.user.fields.Tipo) {
                    case User.USER_TYPE.RESPONSAVEL:
                        return [{ key: '2', title: 'Execuções' }]
                    case User.USER_TYPE.CUIDADOR:
                        return [
                            { key: '1', title: 'Procedimentos' }
                            // { key: '2', title: 'Execuções' }
                        ]
                }
            })(),
            Dependentes: []
        }
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case '1': return (
                <ProceduresTodos 
                    Dependentes={this.state.Dependentes}
                    registroAtividade={this.registroAtividade.bind(this)} />
                )
            // case '2': return <ExecStories />
        }
    }

    registroAtividade = async (contextoProcedimento, contextoDependente) => {
        let d = new Date()
        let DataExecucao = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
        let HoraExecucao = `${d.getHours()}:${d.getMinutes()}`
        await this.props.db.run(`INSERT INTO EXECUCAO_PROCEDIMENTO (CodigoProcedimento, DescricaoProcedimento, DataExecucao, HoraExecucao, CodigoUsuario)
            VALUES (
                ${contextoProcedimento.CodigoProcedimento},
                "${contextoProcedimento.DescricaoProcedimento}",
                "${DataExecucao}",
                "${HoraExecucao}",
                ${this.props.user.getCodigoUsuario()});`)
        contextoProcedimento.Execucoes.push({
            HoraExecucao,
            DataExecucao,
            Comentarios: ""
        })
        this.forceUpdate()
    }

    fetchExecs = async() => {
        let response = null
        try {
            response = await this.props.db.fetchData(PRESETS_ID.CONTRATOS_PROCEDIMENTOS_EXECUCOES, {
                CodigoUsuarioCuidador: this.props.user.getCodigoUsuario()
            })
        } catch (e) {
            // Alert.alert("Erro", e.message)
        }
        // Alert.alert("dados", JSON.stringify(response.rows))
        response.rows.forEach((row, i) => {
            try {
                row.Prescricoes = JSON.parse(row.Prescricoes)
            } catch(e) {
                Alert.alert("Erro" + i, e.message + ' - ' + row.Prescricoes)
            }
        })
        this.setState({
            loading: false,
            Dependentes: response.rows
        })
    }

    componentDidMount() {
        this.fetchExecs()
    }

    handleChangeTab = index => this.setState({ index })

    render() {
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                {
                    this.state.loading ? (
                        <View style={{'paddingVertical':15}}>
                            <ActivityIndicator size={45} />
                        </View>
                    ) : (
                        <View style={_s("flex",{'zIndex':0})}>
                            <TabViewAnimated
                            navigationState={this.state}
                            renderScene={this.renderScene.bind(this)}
                            renderHeader={props => (
                                <TabBar
                                    style={{backgroundColor: SECONDARY_COLOR}} 
                                    labelStyle={{color: '#000'}}
                                    indicatorStyle={{backgroundColor: PRIMARY_COLOR,height:5}}
                                    {...props}/>
                                )}
                            onRequestChangeTab={this.handleChangeTab.bind(this)}/>
                        </View>
                    )
                }
            </View>
        )
    }
}

class ProceduresTodos extends React.Component {    
    render() {
        return (
            <ScrollView style={{'padding':8}}>
                {
                    (this.props.Dependentes || []).map((Dependente, i) => (
                        <View key={'dep-'+i}>
                            <View style={_s("flex-row center-b",{'marginBottom':8})}>
                                <Text style={_s("flex",{'fontWeight':'bold'})}>Dependente: {Dependente.NomeDependente}</Text>
                            </View>
                            <View style={{ marginLeft: 6, paddingLeft: 8, borderLeftColor: '#DDD', borderLeftWidth: 1 }}>
                                {
                                    (Dependente.Prescricoes || []).map((Prescricao, i) => (
                                        <View key={'presc-'+i}>
                                            <View style={_s("flex-row center-b",{'marginVertical':5})}>
                                                <Text style={_s("flex",{'fontWeight':'bold'})}>Prescrição #{i+1} - Por {Prescricao.NomeMedico} em {Prescricao.DataPrescricao}</Text>
                                            </View>
                                            <View>
                                                {
                                                    (Prescricao.Procedimentos).map((Procedimento, i) => (
                                                        <View key={'proc-'+i}>
                                                            <ListItem
                                                                label={Procedimento.DescricaoProcedimento + ' - ' + Procedimento.FrequenciaDia + ' vez(es) por ' + Procedimento.DuracaoDias + ' dia(s)'}>
                                                                <View>
                                                                    <ImprovedTouchable onPress={() => this.props.registroAtividade(Procedimento, Dependente)}>
                                                                        <View>
                                                                            <Text> Registrar atividade </Text>
                                                                        </View>
                                                                    </ImprovedTouchable>
                                                                </View>
                                                            </ListItem>
                                                            {
                                                                Procedimento.Execucoes.map((Execucao, i) => (
                                                                    <View key={'exec-'+i} style={{ marginLeft: 7, marginVertical: 3 }}>
                                                                        <Text>Você executou esta tarefa {Execucao.DataExecucao} às {Execucao.HoraExecucao}.</Text>
                                                                    </View>
                                                                ))
                                                            }
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        )
    }
}

class ExecStories extends React.Component {
    render() {
        return (
            <ScrollView>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db,
    user: state.user
})

const ProceduresPage = connect(mapStateToProps)(Procedures)
export default ProceduresPage