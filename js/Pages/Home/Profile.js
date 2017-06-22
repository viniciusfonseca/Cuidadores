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

import { noop } from '../../App'

import { arrayToggleElement } from './Search'

const FormTextField = props => (
    <View style={_s("flex-stretch", { 'marginTop': 8 })}>
        <Text>{props.label}</Text>
        <TextInput
            underlineColorAndroid="transparent"
            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })}
            onChangeText={props.onChange || noop}
            keyboardType="ascii-capable"
            multiline={props.multiline || false}
            autoCapitalize="sentences"
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

            modalDependenteVisible:     false,
            modalEspecialidadesVisible: false
        }
    }

    componentDidMount() {
        let parseFields = [
            "Dependentes",
            "Especialidades",
            "Contratos"
        ];
        (async() => {
            // Alert.alert("user", JSON.stringify( this.props.user.fields ))
            let dataUserBackend = (await this.props.db.fetchData(PRESETS_ID.USER_VIEW, {
                CodigoUsuario: this.user.CodigoUsuario
            })).rows[0]
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
        })()
    }

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
                        oferecerServicoDependente: mkWrapper(context, 'oferecerServicoDependente')
                    }
                    case '2': return {}
                    case '3': return {
                        showEspecialidadesModal:   mkWrapper(context, 'showEspecialidadesModal')
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

    showDependenteModal() { this.setState({ modalDependenteVisible: true }) }

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

    showEspecialidadesModal() { this.setState({ modalEspecialidadesVisible: true }) }

/*
    ************************************************************************************
        FIM TRATAMENTO DE EVENTOS
    ************************************************************************************
*/

    concluiDependenteModal = async contextoDependente => {
        Alert.alert("user", Object.keys(this.props.user).toString())
        let criandoDependente = !contextoDependente.CodigoDependente
        if (!contextoDependente.NomeDependente.trim()) {
            ToastAndroid.show("Necessário preencher nome do dependente", ToastAndroid.SHORT)
            return
        }
        if (criandoDependente) {
            let novoDependente = await this.props.user.criarDependente( contextoDependente )
            this.user.Dependentes.push( novoDependente )
            this.forceUpdate()
        }
        else {
            this.props.user.atualizarDependente( contextoDependente ) 
        }
    } 

    renderDependenteModal( contextoDependente = { NomeDependente: '' } ) {
        contextoDependente = Object.assign({}, contextoDependente)
        let criandoDependente = !contextoDependente.CodigoDependente
        return (
            <Modal 
                isVisible={this.state.modalDependenteVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>{criandoDependente? 'Criar Dependente': 'Editar Dependente'}</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalDependenteVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <ScrollView style={{'padding':8}}>
                        <FormTextField
                            label="Nome do Dependente"
                            onChange={val => contextoDependente.NomeDependente = val} />
                        <FormTextField
                            label="Observações" last={true}
                            onChange={val => contextoDependente.Observacoes = val} />
                        <Button
                            label={criandoDependente? 'Criar Dependente': 'Aplicar mudanças'}
                            onPress={this.concluiDependenteModal.bind(this, contextoDependente)} />
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
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>Selecionar Especialidade</Text>
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
                                    onPress={noop}>
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
                { this.isVisitingOwnProfile && this.user.Tipo == User.USER_TYPE.RESPONSAVEL && this.renderDependenteModal.call(this) }
                { this.isVisitingOwnProfile && this.user.Tipo == User.USER_TYPE.CUIDADOR    && this.renderEspecialidadesModal.call(this) }
                
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
                                    switch (this.user.Tipo) {
                                        case User.USER_TYPE.CUIDADOR:
                                            return <View />
                                        case User.USER_TYPE.RESPONSAVEL:
                                            return (
                                                <View style={{marginTop:6}}>
                                                    <Button label="Contratar cuidador" />
                                                </View>
                                            )
                                    }
                                })}
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

    render() {
        return this.props.value.length == 0? (
            <View style={_s("center-a center-b", {height: 85})}>
                <Text style={{'textAlign':'center'}}>Você ainda não possui um dependente.</Text>
                <ImprovedTouchable onPress={ this.props.showDependenteModal }>
                    <View>
                        <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                            Clique para adicionar um dependente
                        </Text>
                    </View>
                </ImprovedTouchable>
            </View>
        ): (
            <ScrollView>
                <FlatList
                    data={this.props.value}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.CodigoDependente} />
            </ScrollView>
        )
    }
}

class Contratos extends React.Component {
    render() {
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
    renderItem({ item }) {
        return <ListItem label={item.DescricaoEspecialidade} />
    }

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
                <ImprovedTouchable onPress={ this.props.showEspecialidadesModal }>
                    <View>
                        <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                            Adicionar uma especialidade
                        </Text>
                    </View>
                </ImprovedTouchable>
                <FlatList
                    data={this.props.value}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.CodigoEspecialidade} />
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