import React from 'react'

import { 
    View, ScrollView, Text,
    Image, Alert, ActivityIndicator,
    FlatList, TextInput,
    ToastAndroid
} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import LinearGradient from 'react-native-linear-gradient'
import { MaskService } from 'react-native-masked-text'
import Modal from 'react-native-modal'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/Entypo'

import { PRESETS_ID } from '../../Backend/QueryPresets'
import User from '../../Backend/User'

import { connect } from 'react-redux'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

import NavBar, { NavBarShadow } from '../../Components/NavBar'
import Button from '../../Components/Button'
import ListItem from '../../Components/ListItem'
import ImprovedTouchable from '../../Components/ImprovedTouchable'
import Spinner from '../../Components/Spinner'

import { noop } from '../../App'

import { arrayToggleElement } from './Search'

const FormTextField = props => (
    <View style={_s("flex-stretch", Object.assign({ 'marginTop': 8 }, props.style || {}))}>
        <Text>{props.label}</Text>
        <TextInput
            underlineColorAndroid="transparent"
            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })}
            onChangeText={props.onChange || noop}
            keyboardType="ascii-capable"
            multiline={props.multiline || false}
            autoCapitalize="sentences"
            value={ props.value }
            defaultValue={ props.defaultValue }
            keyboardType={ props.type }
            />
    </View>
)

class Profile extends React.Component {
    static get upperSectionStyle() {
        return {
            minHeight: 120, 
            backgroundColor: TERTIARY_COLOR, 
            borderBottomWidth: 1, 
            borderColor: '#DDD',
            paddingTop: 15,
            paddingHorizontal: 15,
            position: 'relative',
            zIndex: 0
        }
    }
    user = {}

    constructor(props) {
        super(props)
        const params = Object.assign({}, this.props.navigation.state.params)
        this.user.CodigoUsuario = params && params.CodigoUsuario || this.props.user.getCodigoUsuario()
        this.isVisitingOwnProfile = this.user.CodigoUsuario == this.props.user.getCodigoUsuario()
        this.asStack = Boolean(params.asStack)
        this.state = {
            loading: true,
            index: 0,
            routes: [],

            modalSelectDepVisible:      false,
            modalDependenteVisible:     false,
            modalEspecialidadesVisible: false,

            spinnerVisible: false,
            textSpinner: '',

            contextoDependente: {}
        }
    }

    componentDidMount() {
        this.fetchUser()
    }

    fetchUser = async() => {
        let parseFields = [
            "Dependentes",
            "Especialidades",
            "Contratos"
        ];
        // Alert.alert("user", JSON.stringify( this.props.user.fields ))
        let dataUserBackend = (await this.props.db.fetchData(PRESETS_ID.USER_VIEW, {
            CodigoUsuario: this.user.CodigoUsuario
        })).rows[0]
        // Alert.alert("user", JSON.stringify( dataUserBackend ))
        this.user = Object.assign({}, this.user, dataUserBackend)
        parseFields.forEach(field => {
            try {
                this.user[field] = this.user[field] || '[]'
                this.user[field] = JSON.parse(this.user[field])
            }
            catch(e) {
                this.user[field] = []
            }
        })

        let routes = []
        switch (this.user.Tipo) {
            case User.USER_TYPE.RESPONSAVEL:
                routes = [
                    {
                        key: '1',
                        title: 'Dependentes'
                    },
                    {
                        key: '2',
                        title: 'Contratos'
                    }
                ]
                break
            case User.USER_TYPE.CUIDADOR:
                routes = [
                    {
                        key: '3',
                        title: 'Especialidades'
                    },
                    {
                        key: '2',
                        title: 'Contratos'
                    }
                ]
        }
        this.setState({ routes }, () => {
            this.setState({ loading: false })
        })
        this.buscaEspecialidades()
    }

    reload() { this.setState({ loading: true }, this.fetchUser.bind( this )) }

    renderScene = ({ route }) => {
        let componentClass = null, key = ""
        switch (route.key) {
            case '1': componentClass = Dependentes;    key = "Dependentes";    break
            case '2': componentClass = Contratos;      key = "Contratos";      break
            case '3': componentClass = Especialidades; key = "Especialidades"; break
        }
        const mkWrapper = (context, fnName) => context[ fnName ].bind( context )
        return React.createElement(
            componentClass,
            Object.assign({
                value: this.user[ key ],
                isVisitingOwnProfile: this.isVisitingOwnProfile
            }, (( context ) => {
                switch (route.key) {
                    case '1': return {
                        showDependenteModal:       mkWrapper(context, 'showDependenteModal'),
                        oferecerServicoDependente: mkWrapper(context, 'oferecerServicoDependente'),
                        apagaDependente:           mkWrapper(context, 'apagaDependente')
                    }
                    case '2': return {}
                    case '3': return {
                        showEspecialidadesModal:   mkWrapper(context, 'showEspecialidadesModal'),
                        adicionaEspecialidade:     mkWrapper(context, 'adicionaEspecialidade'),
                        apagaEspecialidade:        mkWrapper(context, 'apagaEspecialidade')
                    }
                }
            })(this))
        )
    }

    handleChangeTab = index => this.setState({ index })

/*
    ************************************************************************************
        TRATA EVENTOS DAS SUBVIEWS
    ************************************************************************************
*/

    showDependenteModal( item ) {
        this.prescricoesAnteriores = null
        this.setState({
            modalDependenteVisible: true,
            contextoDependente: Object.assign({}, item || {})
        })
    }

    oferecerServicoDependente() {
        Alert.alert("Oferecer Serviço", "Deseja oferecer serviço a este dependente?", [
            {
                text: 'Não',
                onPress: noop
            },
            {
                text: 'Sim',
                onPress: () => replaceState({
                    navigation: this.props.parentNavigation
                }, Actions.PossibleRoutes.LOGIN)
            }
        ])
    }

    showEspecialidadesModal() {
        this.setState({ modalEspecialidadesVisible: true })
    }

    apagaDependente = async contextoDependente => {
        Alert.alert("Apagar depedente", "Deseja excluir este dependente?", [
            {
                text: 'Não',
                onPress: noop
            },
            {
                text: 'Sim',
                onPress: async() => {
                    await this.props.user.apagarDependente( contextoDependente )
                    this.user.Dependentes = this.user.Dependentes.filter(
                        dependente => dependente.CodigoDependente !== contextoDependente.CodigoDependente
                    )
                    this.forceUpdate()
                }
            }
        ])
    }

    apagaEspecialidade( contextoEspecialidade ) {
        this.user.Especialidades = this.user.Especialidades.filter(
            especialidade => especialidade.CodigoEspecialidade !== contextoEspecialidade.CodigoEspecialidade
        )
        this.forceUpdate()
    }

/*
    ************************************************************************************
        FIM TRATAMENTO DE EVENTOS
    ************************************************************************************
*/

    concluiDependenteModal = async (contextoDependente, prescricoesAnteriores) => {
        // Alert.alert("user", Object.keys(this.props.user).toString())
        if (!(contextoDependente.NomeDependente && contextoDependente.NomeDependente.trim())) {
            ToastAndroid.show("Necessário preencher nome do dependente", ToastAndroid.SHORT)
            return
        }
        let criandoDependente = !contextoDependente.CodigoDependente
        this.setState({
            spinnerVisible: true,
            textSpinner: criandoDependente? 'Criando dependente' : 'Atualizando informações'
        })
        if (criandoDependente) {
            await this.props.user.criarDependente( contextoDependente )
            ToastAndroid.show("Dependente criado com sucesso", ToastAndroid.SHORT)
        }
        else {
            await this.props.user.atualizarDependente( contextoDependente, prescricoesAnteriores )
            ToastAndroid.show("Dependente atualizado com sucesso", ToastAndroid.SHORT)
        }
        this.prescricoesAnteriores = null
        this.setState({
            spinnerVisible: false,
            modalDependenteVisible: false
        }, this.reload.bind(this))
    }

    prescricoesAnteriores = null
    // ##1
    renderDependenteModal() {
        let contextoDependente = this.state.contextoDependente
        contextoDependente.Prescricoes = contextoDependente.Prescricoes || []
        this.prescricoesAnteriores = this.prescricoesAnteriores || contextoDependente.Prescricoes.slice().map(
            Prescricao => Object.assign({}, Prescricao, { Procedimentos: Prescricao.Procedimentos.slice().map(
                Procedimento => Object.assign({}, Procedimento)
            )})
        )
        // Alert.alert("DEP", JSON.stringify( contextoDependente ))
        let criandoDependente = !contextoDependente.CodigoDependente

        const adicionaPrescricao = () => {
            contextoDependente.Prescricoes.push({ Procedimentos: [] })
            this.forceUpdate()
        }
        const adicionaProcedimento = contextoPrescricao => {
            contextoPrescricao.Procedimentos.push({ FrequenciaDia: '1', DuracaoDias: '7' })
            this.forceUpdate()
        }
        const apagaPrescricao = contextoPrescricao => {
            Alert.alert("Apagar prescrição", "Deseja realmente apagar esta prescrição?", [
                {
                    text: 'Não',
                    onPress: noop
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        contextoDependente.Prescricoes = contextoDependente.Prescricoes.filter(p => p !== contextoPrescricao)
                        this.forceUpdate()
                    }
                }
            ])
        }
        const apagaProcedimento = (contextoPrescricao, contextoProcedimento) => {
            contextoPrescricao.Procedimentos = contextoPrescricao.Procedimentos.filter(p !== contextoProcedimento)
            this.forceUpdate()
        }
        return (
            <Modal 
                isVisible={this.state.modalDependenteVisible}
                animationIn="fadeInUp" 
                animationOut="fadeOutDown"
                onModalHide={() => { this.prescricoesAnteriores = null; this.setState({ modalDependenteVisible: false }) }}>
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>
                                { criandoDependente? 'Criar Dependente': 'Editar Dependente' }
                            </Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalDependenteVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <ScrollView style={{'padding':8}}>
                        <View style={_s("flex-row center-b",{'marginBottom':8})}>
                            <Text style={_s("flex",{'fontWeight':'bold'})}>Informações Gerais</Text>
                        </View>
                        <FormTextField
                            label="Nome do Dependente"
                            defaultValue={contextoDependente.NomeDependente}
                            onChange={val => contextoDependente.NomeDependente = val} />
                        <FormTextField
                            label="Observações" last={true}
                            defaultValue={contextoDependente.Observacoes}
                            onChange={val => contextoDependente.Observacoes = val} />
                        <View style={_s("flex-row",{'marginVertical':8})}>
                            <Text style={_s("flex",{'fontWeight':'bold'})}>Prescrições</Text>
                        </View>
                        <ImprovedTouchable onPress={ adicionaPrescricao }>
                            <View style={_s("flex-row center-b",{borderBottomWidth:1,borderColor:'#DEDEDE'})}>
                                <Text style={{'textDecorationLine':'underline','paddingVertical':15,'marginLeft':10,'flex':1}}>
                                    Adicionar uma prescrição
                                </Text>
                                <Icon name="plus" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                        {
                            contextoDependente.Prescricoes.map((Prescricao, i) => (
                                <View key={'presc-'+i}>
                                    <View style={_s("flex-row",{'marginVertical':8})}>
                                        <Text style={_s("flex",{'fontWeight':'bold'})}>Prescrição #{i+1}</Text>
                                        <ImprovedTouchable onPress={() => apagaPrescricao(Prescricao)}>
                                            <Text style={{textDecorationLine: 'underline'}}>Excluir</Text>
                                        </ImprovedTouchable>
                                    </View>
                                    <View style={_s("flex-row",{ alignSelf: 'stretch'})}>
                                        <View style={_s("flex")}>
                                            <FormTextField
                                                label="Nome do Médico"
                                                defaultValue={Prescricao.NomeMedico}
                                                onChange={val => Prescricao.NomeMedico = val} />
                                            <View style={_s("flex-row")}>
                                                <FormTextField
                                                    style={{ flex: 1 }}
                                                    label="CRM"
                                                    defaultValue={Prescricao.CRM}
                                                    onChange={val => Prescricao.CRM = val} />
                                                <FormTextField
                                                    style={{ flex: 1 }}
                                                    label="Data da Prescrição" last={true} type="numeric"
                                                    defaultValue={Prescricao.DataPrescricao}
                                                    onChange={val => Prescricao.DataPrescricao = val} />
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{marginLeft: 12, paddingLeft: 12, borderLeftWidth:1, borderColor:'#DDD'}}>
                                            <ImprovedTouchable onPress={() => adicionaProcedimento(Prescricao)}>
                                                <View style={_s("flex-row center-b",{borderBottomWidth:1,borderColor:'#DEDEDE'})}>
                                                    <Text style={{'textDecorationLine':'underline','paddingVertical':15,'marginLeft':10,'flex':1}}>
                                                        Adicionar um procedimento
                                                    </Text>
                                                    <Icon name="plus" style={{'fontSize':26,'color':'#000',}} />
                                                </View>
                                            </ImprovedTouchable>
                                            {
                                                Prescricao.Procedimentos.map((Procedimento, i) => (
                                                    <View key={'proc-'+i}>
                                                        <View style={_s("flex-row",{'marginVertical':8})}>
                                                            <Text style={_s("flex",{'fontWeight':'bold'})}>Procedimento #{i+1}</Text>
                                                            <ImprovedTouchable onPress={() => apagaProcedimento(Prescricao, Procedimento)}>
                                                                <Text style={{textDecorationLine: 'underline'}}>Excluir</Text>
                                                            </ImprovedTouchable>
                                                        </View>
                                                        <View style={{ alignSelf: 'stretch', flex: 1 }}>
                                                            <FormTextField
                                                            style={{ flex: 1 }}
                                                                label="Descrição"
                                                                defaultValue={Procedimento.DescricaoProcedimento}
                                                                onChange={val => Procedimento.DescricaoPrescricao = val} />
                                                            <View style={_s("flex-row")}>
                                                                <FormTextField
                                                                    style={{ flex: 1 }}
                                                                    label="Vezes ao dia" type="numeric"
                                                                    defaultValue={Procedimento.FrequenciaDia || '1'}
                                                                    onChange={val => Prescricao.FrequenciaDia = val} />
                                                                <FormTextField
                                                                    style={{ flex: 1 }}
                                                                    label="Duração em dias" type="numeric"
                                                                    defaultValue={Procedimento.DuracaoDias || '7'}
                                                                    onChange={val => Prescricao.DuracaoDias = val} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                        <View style={{marginVertical:4}} />
                        <Button
                            label={criandoDependente? 'Criar Dependente': 'Aplicar mudanças'}
                            onPress={() => {
                                this.concluiDependenteModal( contextoDependente, this.prescricoesAnteriores )
                            }} />
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    buscaEspecialidades = async() => {
        let res = null
        try {
            res = await this.props.db.fetchData(PRESETS_ID.ESPECIALIDADES)
            this.especialidades = res.rows
        }
        catch(e) {
            Alert.alert("ERR1", e.message)
        }
    }

    adicionaEspecialidade = async contextoEspecialidade => {
        await this.props.user.adicionaEspecialidade( contextoEspecialidade )
        this.setState({ modalEspecialidadesVisible: false }, this.reload.bind(this))
    }

    renderEspecialidadesModal( context = {} ) {
        const especialidades = Object.assign([], this.user.Especialidades)
        return (
            <Modal
                isVisible={this.state.modalEspecialidadesVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>Adicionar Especialidade</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalEspecialidadesVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <ScrollView style={{'padding':8}}>
                        {
                            this.especialidades && this.especialidades.map(especPtr => (
                                <ImprovedTouchable
                                    key={especPtr.CodigoEspecialidade}
                                    onPress={() => this.adicionaEspecialidade(especPtr)}>
                                    <View style={{flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#DDD'}}>
                                        <Text>{ especPtr.DescricaoEspecialidade }</Text>
                                    </View>
                                </ImprovedTouchable>
                            ))
                        }
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    optsDependentes = null
    renderSelectDepModal() {
        return (
            <Modal
                isVisible={this.state.modalEspecialidadesVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>Escolher dependente</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalSelectDepVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <ScrollView style={{'padding':8}}>
                        <View style={_s("flex-row center-b",{'marginBottom':8})}>
                            <Text style={_s("flex",{'fontWeight':'bold'})}>Escolha um dependente para este contrato</Text>
                        </View>
                        {
                            this.optsDependentes.map(Dependente => (
                                <ListItem key={'depsel-'+Dependente.CodigoDependente}
                                    label={Dependente.NomeDependente}
                                    onPress={() => this.concluiContratoCuidador(contextoDependente)}/>
                            ))
                        }
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    // ##2
    contratarCuidador() {
        Alert.alert("Contratar Cuidador", "Deseja contratar este cuidador?", [
            {
                text: 'Não',
                onPress: noop
            },
            {
                text: 'Sim',
                onPress: () => this.setState({
                    spinnerVisible: true
                }, async() => {
                    const Dependentes = (await this.props.user.db.fetchData(PRESETS_ID.DEPENDENTES, { CodigoUsuario: this.props.user.getCodigoUsuario() })).rows
                    if (!Dependentes.length) {
                        ToastAndroid.show("Necessário ter um dependente cadastrado para contratar este cuidador", ToastAndroid.SHORT)
                        this.setState({
                            spinnerVisible: false
                        })
                        return
                    }
                    this.optsDependentes = Dependentes
                    this.setState({ modalSelectDepVisible: true })
                })
            }
        ])
    }

    concluiContratoCuidador = async contextoDependente => {
        await User.Contratos.Novo(this.props.user.db, {
            CodigoUsuarioCuidador: this.user.CodigoUsuario,
            CodigoDependente: contextoDependente.CodigoDependente,
            Requerente: User.Contratos.Status.PENDENTE_RESPONSAVEL
        })
        ToastAndroid.show("Proposta enviada ao cuidador", ToastAndroid.SHORT)
        this.setState({ modalSelectDepVisible: false })
    }

    render() {
        let user = this.user
        // Alert.alert("user", JSON.stringify( user ))
        
        /*<View style={{marginTop:6}}>
            <Button label="Editar perfil" />
        </View>*/
        /*<View style={{marginTop:6}}>
            <Button label="Oferecer serviço" />
        </View>*/

        return (
            <View style={_s("flex blank")}>
                <Spinner visible={this.state.spinnerVisible} size={70}
                    textStyle={{color:'#FFFFFF'}}
                    textContent={this.state.textSpinner} />
                {  this.isVisitingOwnProfile && this.user.Tipo == User.USER_TYPE.RESPONSAVEL              && this.renderDependenteModal.call(this) }
                {  this.isVisitingOwnProfile && this.user.Tipo == User.USER_TYPE.CUIDADOR                 && this.renderEspecialidadesModal.call(this) }
                { !this.isVisitingOwnProfile && this.props.user.fields.Tipo == User.USER_TYPE.RESPONSAVEL && this.renderSelectDepModal.call(this) }
                <NavBar
                    enableBackBtn={this.asStack}
                    enableNavBtn={!this.asStack}
                    navigation={this.props.navigation}
                    parentNavigation={this.props.parentNavigation} />
                <NavBarShadow />
                {this.state.loading ? (
                    <View style={{'paddingVertical':15}}>
                        <ActivityIndicator size={45} />
                    </View>
                ) : (
                    <View style={_s("flex")}>
                        <View style={_s("flex-row", Profile.upperSectionStyle)}>
                            <View style={_s("center-a")}>
                                <Image source={require('../../img/avatar-large.png')} 
                                    style={{ 'height': 60, 'width': 60, 'borderRadius': 30 }}
                                    resizeMode="contain" />
                            </View>
                            <View style={{marginLeft:14}}>
                                <Text>{user.Nome}</Text>
                                <Text style={{marginVertical: 2}}>{user.Localizacao}</Text>
                                <Text>Telefone: {MaskService.toMask('cel-phone', user.Telefone, {})}</Text>
                                {this.isVisitingOwnProfile? (
                                    <View />
                                ): (() => {
                                    switch (user.Tipo) {
                                        case User.USER_TYPE.RESPONSAVEL:
                                            return <View />
                                        case User.USER_TYPE.CUIDADOR:
                                            return this.props.user.fields.Tipo == User.USER_TYPE.RESPONSAVEL && (
                                                <View style={{marginTop:6}}>
                                                    <Button label="Contratar cuidador" onPress={this.contratarCuidador.bind(this)} />
                                                </View>
                                            )
                                    }
                                })()}
                            </View>
                        </View>
                        <TabViewAnimated
                            navigationState={this.state}
                            renderScene={this.renderScene.bind(this)}
                            renderHeader={props => (
                                <TabBar 
                                    style={{backgroundColor: SECONDARY_COLOR}} 
                                    labelStyle={{color: '#000'}}
                                    indicatorStyle={{backgroundColor:PRIMARY_COLOR,height:5}}
                                    {...props}/>
                                )}
                            onRequestChangeTab={this.handleChangeTab.bind(this)}/>
                    </View>
                )}
            </View>
        )
    }
}

/*
    ************************************************************************************
        SUBVIEW DE DEPENDENTES
    ************************************************************************************
*/
class Dependentes extends React.Component {
    constructor(props) {
        super(props)
    }

    renderItem = ( item, index ) => (
        <ListItem key={'d-'+item.CodigoDependente} 
            label={item.NomeDependente}
            onPress={() => this.props.showDependenteModal( item )}>
            {
                this.props.isVisitingOwnProfile && (
                    <ImprovedTouchable onPress={() => this.props.apagaDependente( item )}>
                        <View>
                            <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                        </View>
                    </ImprovedTouchable>
                )
            }
        </ListItem>
    )

    render() {
        return this.props.value.length == 0? (
            <View style={_s("center-a center-b", {height: 85})}>
                <Text style={{'textAlign':'center'}}>Você ainda não possui um dependente.</Text>
                <ImprovedTouchable onPress={() => this.props.showDependenteModal() }>
                    <View>
                        <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                            Clique para adicionar um dependente
                        </Text>
                    </View>
                </ImprovedTouchable>
            </View>
        ): (
            <ScrollView style={_s("flex", {paddingHorizontal:12})}>
                {
                    this.props.isVisitingOwnProfile && (
                        <ImprovedTouchable onPress={ this.props.showDependenteModal }>
                            <View style={_s("flex-row center-b",{borderBottomWidth:1,borderColor:'#DEDEDE'})}>
                                <Text style={{'textDecorationLine':'underline','paddingVertical':15,'marginLeft':10,'flex':1}}>
                                    Adicionar um dependente
                                </Text>
                                 <Icon name="plus" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    )
                }
                { this.props.value.map(this.renderItem) }
            </ScrollView>
        )
    }
}

class Contratos extends React.Component {
    render() {
        const contratosPendentes = this.props.value.filter(Contrato => Contrato.Status === User.Contratos.Status.PENDENTE_CUIDADOR || Contrato.Status === User.Contratos.Status.PENDENTE_RESPONSAVEL)
        const contratosAceitos   = this.props.value.filter(Contrato => Contrato.Status === User.Contratos.Status.ACEITO)
        return (
            this.props.value.length == 0 ? (
                this.props.isVisitingOwnProfile ? (
                    <View style={_s("center-a center-b", {height: 85})}>
                        <Text style={{textAlign:'center'}}>Você ainda não possui um contrato.</Text>
                    </View>
                ) : (
                    <View style={_s("center-a center-b", {height: 85})}>
                        <Text style={{textAlign:'center'}}>Você ainda não possui um contrato com este cuidador.</Text>
                    </View>
                )
            ) : (
                <View>
                    <Text>TODO: Contratos</Text>
                </View>
            )
        )
    }
}

/*
    ************************************************************************************
        SUBVIEW DE ESPECIALIDADES
    ************************************************************************************
*/
class Especialidades extends React.Component {

    renderItem = ( item, index ) => (
        <ListItem key={'d-'+item.CodigoEspecialidade} 
            label={item.DescricaoEspecialidade}>
            {
                this.props.isVisitingOwnProfile && (
                    <ImprovedTouchable onPress={() => this.props.apagaEspecialidade(item)}>
                        <View>
                            <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000'}} />
                        </View>
                    </ImprovedTouchable>
                )
            }
        </ListItem>
    )

    render() {
        return this.props.value.length == 0 ? (
            this.props.isVisitingOwnProfile ? (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Você ainda não possui uma especialidade.</Text>
                    <ImprovedTouchable onPress={ this.props.showEspecialidadesModal }>
                        <View>
                            <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                                Clique para adicionar uma especialidade
                            </Text>
                        </View>
                    </ImprovedTouchable>
                </View>
            ) : (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Este cuidador ainda não possui uma especialidade.</Text>
                </View>
            )
        ) : (
            <View style={_s("flex", {paddingHorizontal:12})}>
                {
                    this.props.isVisitingOwnProfile && (
                        <ImprovedTouchable onPress={ this.props.showEspecialidadesModal }>
                            <View style={_s("flex-row center-b", {borderBottomWidth:1,borderColor:'#DEDEDE'})}>
                                <Text style={{'textDecorationLine':'underline','paddingVertical':15,'marginLeft':10,'flex':1}}>
                                    Adicionar uma especialidade
                                </Text>
                                <Icon name="plus" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    )
                }
                { this.props.value.map(this.renderItem) }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    parentNavigation: state.navigation,
    user: state.user,
    db: state.db
})
const ProfilePage = connect(mapStateToProps)(Profile)

export default ProfilePage