import React from 'react'

import * as Actions from '../Actions'
import { initialState } from '../Reducers'

import { connect } from 'react-redux'
import update from 'immutability-helper'

import {
    View, Text, TextInput, 
    TouchableHighlight, 
    Alert, Image, ScrollView, 
    ToastAndroid
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import _s, { gradientA } from '../Style'
import { noop } from '../App'

import NavBar from '../Components/NavBar'
import SubHeader from '../Components/SubHeader'
import Spinner from '../Components/Spinner'

import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'

import { TextInputMask } from 'react-native-masked-text'

const FormSection = props => (
    <View style={_s("form-section")}>
        <Text>{props.label}</Text>
    </View>
)

const maskPlaceholders = {
    'cel-phone': "(99) 99999-9999",
    'cpf': "999.999.999-99"
}

const maskMaxLength = {
    'cel-phone': 15,
    'cpf': 14
}

const FormField = props => (
    <View style={_s("flex-stretch", { 'marginTop': 8 })}>
        <Text>{props.label}</Text>
        {(() => {
            props.onChangeText = props.onChangeText || noop
            switch (props.type) {
                case 'date':
                    return (
                        <DatePicker
                            style={_s("form-section", {'width':'100%'})}
                            mode="date"
                            date={props.context.state.user.date}
                            placeholder="Selecione a data"
                            format="DD/MM/YYYY"
                            maxDate={new Date()}
                            confirmBtnText="OK"
                            cancelBtnText="Cancelar"
                            customStyles={{
                                dateIcon: {
                                    width: 0,
                                    height: 0
                                },
                                dateInput: {
                                    borderWidth: 0,
                                    alignItems: 'flex-start'
                                },
                                placeholderText: {
                                    
                                }
                            }}
                            ref={props.inputRef}
                            onDateChange={date => {
                                props.context.state.user.date = value
                                context.forceUpdate()
                            }}
                        />
                    )
                case 'masked':
                    return (
                        <TextInputMask type={props.maskType} underlineColorAndroid="transparent" maxLength={ maskMaxLength[props.maskType] }
                            placeholder={ maskPlaceholders[props.maskType] }
                            placeholderTextColor="#CCCCCC"
                            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })} 
                            onKeyPress={props.onKeyPress || noop}
                            ref={props.inputRef} />
                    )
                case 'text':
                default:
                    return (
                        <TextInput accessibilityLabel={props.label} underlineColorAndroid="transparent"
                            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })}
                            onChangeText={props.onChangeText || noop}
                            returnKeyType="next"
                            onKeyPress={props.onKeyPress || noop}
                            secureTextEntry={props.password} 
                            ref={props.inputRef}
                            autoCapitalize={props.shouldNotCapitalize? "none": "sentences"} />
                    )
            }
        })()}
    </View>
)

const Button = props => (
    <TouchableHighlight onPress={props.onPress} underlayColor="#48ce48" style={_s("button flex button-a flex-stretch", { 'marginBottom': 20 })}>
        <View style={_s("flex center-a center-b")}>
            <Text>{props.label}</Text>
        </View>
    </TouchableHighlight>
)

class Register extends React.Component {
    inputHash = {}

    constructor(props) {
        super(props)
        this.state = {
            registering: false,
            user: Object.assign({}, initialState.user)
        }
    }

    static get INPUT_CONFIG() {
        return [
            { label: 'Sou um Responsável', value: 0 },
            { label: 'Sou um Cuidador', value: 1 }
        ]
    }

    storeInput(field) {
        return ref => this.inputHash[field] = ref
    }

    handleNext() {

    }

    registerUser() {
        Object.keys(this.inputHash).forEach(field => {
            if (field == 'datanasc') {
                Alert.alert('inputDate', this.inputHash.datanasc.state.date + "")
            }
        })
        this.setState({ registering: true })
        setTimeout(() => {
            this.setState({ registering: false })
            ToastAndroid.show("Cadastro realizado com sucesso", ToastAndroid.SHORT)
        }, 3000)
    }

    render() {
        return (
            <View style={_s("flex flex-stretch blank")}>
                <Spinner visible={this.state.registering} textContent="Cadastrando..." textStyle={{color:'#FFFFFF'}} size={70}/>
                <NavBar enableBackBtn={true} navigation={this.props.navigation} />
                <SubHeader label="CADASTRO" />
                <View style={_s("flex flex-stretch")}>
                    <ScrollView style={{ 'padding': 8 }}>
                        <View style={_s("center-a")}>
                            <RadioForm style={_s("flex-stretch")}
                                radio_props={Register.INPUT_CONFIG}
                                formHorizontal={false}
                                animation={false}
                                initial={0}
                                buttonSize={15}
                                buttonOuterSize={30}
                                buttonColor="#000000"
                            />
                        </View>
                        <FormSection label="DADOS PESSOAIS" />
                        <FormField inputRef={this.storeInput.call(this, "nome")} label="Nome" />
                        <FormField inputRef={this.storeInput.call(this, "cpf")} label="CPF" type="masked" maskType="cpf" />
                        <FormField inputRef={this.storeInput.call(this, "datanasc")} label="Data de nascimento" type="date" onChangeText={value => this.setState(Object.assign(this.state.user, {date:value}))} userPtr={this.state.user} />
                        <FormField inputRef={this.storeInput.call(this, "estado")} label="Estado" />
                        <FormField inputRef={this.storeInput.call(this, "cidade")} label="Cidade" />
                        <FormField inputRef={this.storeInput.call(this, "telefone")} label="Telefone" type="masked" maskType="cel-phone" value={this.state.user.telefone} last={true} />
                        <FormSection label="DADOS DE AUTENTICAÇÃO" />
                        <FormField inputRef={this.storeInput.call(this, "email")} label="Email" shouldNotCapitalize={true} />
                        <FormField inputRef={this.storeInput.call(this, "senha")} label="Senha" password={true} shouldNotCapitalize={true} />
                        <FormField inputRef={this.storeInput.call(this, "vSenha")} label="Digite sua senha novamente" password={true} last={true} shouldNotCapitalize={true} />
                        <Button onPress={this.registerUser.bind(this)} label="CADASTRAR" />
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db
})
const RegisterPage = connect(mapStateToProps)(Register)
export default RegisterPage