import React from 'react'

import * as Actions from '../Actions'

import { connect } from 'react-redux'

import { NavigationActions } from 'react-navigation'

import {
    View, Text, TextInput, Alert, Image,
    ToastAndroid, Dimensions
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'

import _s, { gradientA } from '../Style'
import { noop, navigateTo, replaceState } from '../App'

import ImprovedTouchable from '../Components/ImprovedTouchable'
import Spinner from '../Components/Spinner'
import Button from '../Components/Button'

import { PRESETS_ID } from '../Backend/QueryPresets'

class Login extends React.Component {

    emailRecuperacao = ""

    constructor(props) {
        super(props)
        let dims = Dimensions.get("window")
        this.state = {
            auth:  false,
            login: "",
            pass:  "",
            shouldShowCross: dims.height >= 400,
            modalVisible: false,
            __debug__passRec: ""
        }
    }

    componentDidMount() {
        this.props.user.reset()
    }
    
    goToRegister() {
        navigateTo(this.props, Actions.PossibleRoutes.REGISTER)
    }

    authenticateUser() {
        let login = this.state.login.trim()
        let pass  = this.state.pass.trim()

        if (!login || !pass) {
            ToastAndroid.show("Usuario e/ou senha inválida", ToastAndroid.SHORT)
            return
        }

        this.setState({ auth: true })
        let userService = this.props.user
        userService.authenticate(login, pass).then(isAuth => {
            this.setState({ auth: false })
            if (isAuth) {
                replaceState(this.props, Actions.PossibleRoutes.HOME_, {}, NavigationActions.navigate({
                    routeName: Actions.PossibleRoutes.HOME_,
                    params: {
                        parentNavigation: this.props.navigation
                    }
                }))
            }
            else {
                ToastAndroid.show("Usuario e/ou senha inválida", ToastAndroid.SHORT)
            }
        }).catch(e => {
            ToastAndroid.show("Ocorreu um erro durante a autenticação", ToastAndroid.SHORT)
        })
    }

    onLayout = event => {
        let shouldShowCross = event.nativeEvent.layout.height >= 400
        if (shouldShowCross != this.state.shouldShowCross) {
            this.setState({ shouldShowCross })
        }
    }

    renderPassRecModal() {
        return (
            <Modal 
                isVisible={this.state.modalVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>Esqueci minha senha</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <View style={_s("flex",{'padding':8})}>
                        <Text>Digite seu e-mail abaixo:</Text>
                        <TextInput onChangeText={val => this.emailRecuperacao = val} keyboardType="email-address" style={{marginBottom:7}} />
                        <Button onPress={this.recoverPass.bind(this)} label="RECUPERAR SENHA" />
                        {this.state.__debug__passRec ? (
                            <Text style={{marginTop:8}}>
                                ATENÇÃO: Como o software está em versão alpha, a senha poderá ser informada aqui.
                                A senha para o usuário de email {this.emailRecuperacao} é {this.state.__debug__passRec}.</Text>
                            ) : <View />
                        }
                    </View>
                </View>
            </Modal>
        )
    }

    recoverPass() {
        if (!this.emailRecuperacao) {
            ToastAndroid.show("Por favor informe o seu e-mail", ToastAndroid.SHORT)
            return
        }
        // DEBUG PURPOSE
        (async() => {
            let senha = await this.props.db.fetchData(PRESETS_ID.__DEBUG__PASS_RECOVERY, {
                email: this.emailRecuperacao
            })
            Alert.alert("RES", JSON.stringify(senha))
            if (!senha.rows[0]) {
                ToastAndroid.show("Não existe um usuário cadastrado com este e-mail", ToastAndroid.SHORT)
                return
            }
            this.setState({
                __debug__passRec: senha.rows[0].Senha
            })
        })()
        // DEBUG PURPOSE
    }

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}
                onLayout={this.onLayout.bind(this)}>
                <Spinner visible={this.state.auth}
                    textContent="Autenticando..." 
                    textStyle={{color:'#FFFFFF'}} size={70} />
                {this.renderPassRecModal.call(this)}

                <View style={_s("flex end-a center-b")}>
                    <View style={_s("center-b logo-circle", {
                        'height':this.state.shouldShowCross?110:0,
                        'borderWidth':this.state.shouldShowCross?4:0})}>
                        <Image style={_s("flex")} resizeMode="contain" source={require('../img/cross.png')}/>
                    </View>
                    <Text style={{'fontSize':36}}>Cuidadores</Text>
                </View>
                <View style={{'flex':this.state.shouldShowCross?1:3}}>
                    <View style={_s("center-a center-b")}>
                        <View style={_s("login-input center-a center-b flex-row")}>
                            <Icon name="user" style={{'marginLeft':5, 'fontSize':16}} />
                            <TextInput style={_s("flex")}
                                onChangeText={value => this.setState({ login: value })} 
                                placeholder="Login" keyboardType="email-address" 
                                underlineColorAndroid="transparent"
                                blurOnSubmit={false}
                                onSubmitEditing={() => this.refs.pwd.focus()} />
                        </View>
                        <View style={_s("login-input center-a center-b flex-row")}>
                            <Icon name="key" style={{'marginLeft':5, 'fontSize':16}} />
                            <TextInput style={_s("flex")}
                                ref="pwd"
                                onChangeText={value => this.setState({ pass: value })}
                                placeholder="Senha" keyboardType="ascii-capable" 
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                                onSubmitEditing={this.authenticateUser.bind(this)} />
                        </View>
                    </View>
                    <View style={_s("flex-row center-a center-b", {'marginVertical':7})}>
                        <ImprovedTouchable onPress={this.goToRegister.bind(this)} style={_s("button flex button-a flex-stretch", {'marginRight':10})}>
                            <View style={_s("flex center-a center-b")}>
                                <Text>Cadastrar</Text>
                            </View>
                        </ImprovedTouchable>
                        <ImprovedTouchable onPress={this.authenticateUser.bind(this)} activeOpacity={0.5} underlayColor="#48ce48" style={_s("button flex button-a flex-stretch")}>
                                <View style={_s("flex center-a center-b")}>
                                    <Text>Entrar</Text>
                                </View>
                        </ImprovedTouchable>
                    </View>
                    <View style={_s("center-b")}>
                        <ImprovedTouchable onPress={() => this.setState({ modalVisible: true })}>
                            <View style={{padding:3}}>
                                <Text>Esqueci minha senha</Text>
                            </View>
                        </ImprovedTouchable>
                    </View>
                </View>
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db,
    user: state.user
})

const LoginPage = connect(mapStateToProps)(Login)
export default LoginPage