import React from 'react'

import * as Actions from '../Actions'

import { connect } from 'react-redux'

import {
    View, Text, TextInput, Alert, Image,
    ToastAndroid, Dimensions
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo'

import _s, { gradientA } from '../Style'
import { noop, navigateTo, replaceState } from '../App'

import ImprovedTouchable from '../Components/ImprovedTouchable'
import Spinner from '../Components/Spinner'

class Login extends React.Component {

    constructor(props) {
        super(props)
        let dims = Dimensions.get("window")
        this.state = {
            auth:  false,
            login: "",
            pass:  "",
            shouldShowCross: dims.height >= 400
        }
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
        let userService = this.props.user.userService
        userService.authenticate(login, pass).then(isAuth => {
            this.setState({ auth: false })
            if (isAuth) {
                replaceState(this.props, Actions.PossibleRoutes.HOME_)
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

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}
                onLayout={this.onLayout.bind(this)}>
                <Spinner visible={this.state.auth} 
                    textContent="Autenticando..." 
                    textStyle={{color:'#FFFFFF'}} size={70} />
                <View style={_s("flex end-a center-b")}>
                    <View style={_s("center-b logo-circle", {
                        'height':this.state.shouldShowCross?110:0,
                        'borderWidth':this.state.shouldShowCross?4:0})}>
                        <Image style={_s("flex")} resizeMode="contain" source={require('../img/cross.png')}/>
                    </View>
                    <Text style={{'fontSize':36,'fontFamily':'Pacifico'}}>Cuidadores</Text>
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
                        <ImprovedTouchable onPress={noop}>
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
    user: state.user,
})

const LoginPage = connect(mapStateToProps)(Login)
export default LoginPage