import React from 'react'

import * as Actions from '../Actions'

import { connect } from 'react-redux'

import {
    View, Text, TextInput, TouchableHighlight, Alert, Image
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import _s, { gradientA } from '../Style'
import { noop } from '../App'

class Login extends React.Component {
    constructor(props) {
        super(props)
    }

    goToRegister() {
        let action = Actions.navigateTo(Actions.PossibleRoutes.REGISTER)
        this.props.dispatch(action)
    }

    authenticateUser() {
        
    }

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}>
                <View style={_s("flex end-a center-b")}>
                    <View style={_s("center-b logo-circle")}>
                        <Image style={_s("flex")} resizeMode="contain" source={require('../img/cross.png')}/>
                    </View>
                    <Text style={{'fontSize':36,'fontFamily':'Pacifico'}}>Cuidadores</Text>
                </View>
                <View style={_s("flex")}>
                    <View style={_s("center-a center-b")}>
                        <View style={_s("login-input center-a")}>
                            <TextInput placeholder="Login" keyboardType="email-address" underlineColorAndroid="transparent" />
                        </View>
                        <View style={_s("login-input center-a")}>
                            <TextInput placeholder="Senha" secureTextEntry={true} keyboardType="ascii-capable" underlineColorAndroid="transparent" />
                        </View>
                    </View>
                    <View style={_s("flex-row center-a center-b", {'margin':7})}>
                        <TouchableHighlight onPress={this.goToRegister.bind(this)} underlayColor="#48ce48" style={_s("button flex button-a flex-stretch", {'marginRight':10})}>
                                <View style={_s("flex center-a center-b")}>
                                    <Text>Cadastrar</Text>
                                </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.authenticateUser.bind(this)} underlayColor="#48ce48" style={_s("button flex button-a flex-stretch")}>
                                <View style={_s("flex center-a center-b")}>
                                    <Text>Entrar</Text>
                                </View>
                        </TouchableHighlight>
                    </View>
                    <View style={_s("center-b")}>
                        <TouchableHighlight onPress={noop} delayPressIn={0} underlayColor="#55ed55">
                            <View style={{padding:3}}>
                                <Text>Esqueci minha senha</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({})

const LoginPage = connect(mapStateToProps)(Login)
export default LoginPage