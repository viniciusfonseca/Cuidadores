import React from 'react'

import * as Actions from '../Actions'
import { initialState } from '../Reducers'

import { connect } from 'react-redux'

import ReactNative, {
    View, Text, TextInput, 
    TouchableHighlight, 
    Alert, Image, ScrollView, 
    ToastAndroid, Keyboard
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

function isMasked(field) {
    return field === 'cpf' || field === 'telefone'
}

class FormField extends React.Component {
    maskedInputRef = null

    static get TYPE() {
        return {
            DATE: 'date',
            MASKED: 'masked'
        }
    }

    shouldComponentUpdate() {
        return this.props.type !== FormField.TYPE.MASKED
    }

    render() {
        return (
            <View style={_s("flex-stretch", { 'marginTop': 8 })}>
                <Text>{this.props.label}</Text>
                {(() => {
                    this.props.onChangeText = this.props.onChangeText || noop
                    switch (this.props.type) {
                        case FormField.TYPE.DATE:
                            return (
                                <DatePicker
                                    style={_s("form-section", {'width':'100%'})}
                                    mode="date"
                                    date={this.props.context.state.user.date}
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
                                        }
                                    }}
                                    ref={this.props.inputRef}
                                    onDateChange={date => {
                                        this.props.context.state.user.date = date
                                        this.props.context.forceUpdate()
                                    }}
                                />
                            )
                        case FormField.TYPE.MASKED:
                            return (
                                <TextInputMask type={this.props.maskType} 
                                    underlineColorAndroid="transparent" 
                                    maxLength={ maskMaxLength[this.props.maskType] }
                                    placeholder={ maskPlaceholders[this.props.maskType] }
                                    blurOnSubmit={!!this.props.shouldBlur}
                                    onSubmitEditing={this.props.handleSubmit}
                                    placeholderTextColor="#CCCCCC"
                                    style={_s("form-section", { 'padding': 0, 'marginBottom': this.props.last ? 8 : 0 })} 
                                    ref={e => this.props.inputRef = this.maskedInputRef = e}
                                    onFocus={this.props.onFocus}
                                    onBlur={() => this.props.onChange(this.maskedInputRef.getElement().getRawValue())}
                                />
                            )
                        case 'text':
                        default:
                            return (
                                <TextInput accessibilityLabel={this.props.label} 
                                    underlineColorAndroid="transparent"
                                    style={_s("form-section", { 'padding': 0, 'marginBottom': this.props.last ? 8 : 0 })}
                                    onChangeText={this.props.onChangeText || noop}
                                    keyboardType="ascii-capable"
                                    returnKeyType="next"
                                    secureTextEntry={this.props.password}
                                    ref={this.props.inputRef}
                                    blurOnSubmit={!!this.props.shouldBlur}
                                    onSubmitEditing={this.props.handleSubmit}
                                    onFocus={this.props.onFocus}
                                    autoCapitalize={this.props.shouldNotCapitalize? "none": "sentences"} />
                            )
                    }
                })()}
            </View>
        )
    }
}

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

    sInput(field) {
        return ref => this.inputHash[field] = ref
    }

    getNextField(field) {
        let flagF = false
        let nextF = null
        return Object.keys(this.inputHash).some(sField => {
            if (flagF) {
                nextF = sField
                return true
            }
            flagF = field == sField
        }) ? [this.inputHash[nextF], nextF] : [null, null]
    }

    handleNext(field) {
        return () => {
            let [nextEl, nextF] = this.getNextField(field)
            if (nextEl) {
                if (isMasked(nextF)) {
                    nextEl.getElement().focus()
                }
                else {
                    nextEl.focus()
                }
            }
        }
    }

    handleFocus(field) {
        return () => setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(this.inputHash[field]),
                140,
                true
            );
        }, 150);
    }

    static get FIELD_NAMES() {
        return {
            nome: 'Nome',
            cpf: 'CPF',
            datanasc: 'Data de nascimento',
            estado: 'Estado',
            cidade: 'cidade',
            telefone: 'telefone',
            email: 'E-mail',
            senha: 'Senha',
            vSenha: 'Confirmação de senha'
        }
    }

    registerUser() {
        let cadData = {}, vSenha = null
        for (let [k, v] of Object.entries(this.state.user)) {
            v = v || ""
            v = v.toString().trim()
            if (!v) {
                ToastAndroid.show("O seguinte campo está vazio: " + Register.FIELD_NAMES[k], ToastAndroid.SHORT)
                return
            }
        }
        if (this.state.user.senha !== this.state.user.vSenha) {
            ToastAndroid.show("Confirme a sua senha corretamente", ToastAndroid.SHORT)
        }
        let userData = Object.assign({}, this.state.user)
        delete userData.vSenha
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
                    <ScrollView style={{ 'padding': 8 }} ref="scrollView">
                        <RadioForm
                            radio_props={Register.INPUT_CONFIG}
                            animation={false}
                            formHorizontal={true}
                            labelHorizontal={false}
                            initial={0}
                            buttonSize={18}
                            buttonOuterSize={36}
                            buttonColor="#000000"
                            style={{'height':70,'width':'100%','justifyContent':'center'}}
                            onPress={value => this.state.user.tipo = value} />
                        <FormSection label="DADOS PESSOAIS" />
                        <FormField
                            inputRef={this.sInput.call(this, "nome")} 
                            label="Nome" 
                            onFocus={this.handleFocus.call(this, "nome")} 
                            handleSubmit={this.handleNext.call(this,"nome")} 
                            onChange={value => this.state.user.nome = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "cpf")}
                            label="CPF" 
                            type="masked" 
                            maskType="cpf"
                            shouldBlur={true} onFocus={this.handleFocus.call(this,"cpf")}
                            onChange={value => this.state.user.cpf = value} />
                        <FormField
                            label="Data de nascimento" 
                            type="date"
                            context={this} />
                        <FormField
                            inputRef={this.sInput.call(this, "estado")} 
                            label="Estado" 
                            onFocus={this.handleFocus.call(this,"estado")} 
                            handleSubmit={this.handleNext.call(this,"estado")}
                            onChange={value => this.state.user.estado = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "cidade")}
                            label="Cidade" 
                            onFocus={this.handleFocus.call(this,"cidade")} 
                            handleSubmit={this.handleNext.call(this,"cidade")}
                            onChange={value => this.state.user.cidade = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "telefone")} 
                            label="Telefone" 
                            type="masked" 
                            maskType="cel-phone" 
                            last={true}
                            shouldBlur={true}
                            onFocus={this.handleFocus.call(this,"telefone")}
                            onChange={value => this.state.user.telefone = value} />
                        <FormSection label="DADOS DE AUTENTICAÇÃO" />
                        <FormField
                            inputRef={this.sInput.call(this, "email")} 
                            label="Email" 
                            shouldNotCapitalize={true} 
                            onFocus={this.handleFocus.call(this,"email")} 
                            handleSubmit={this.handleNext.call(this,"email")}
                            onChange={value => this.state.user.email = value} />
                        <FormField 
                            inputRef={this.sInput.call(this, "senha")} 
                            label="Senha" 
                            password={true} 
                            shouldNotCapitalize={true} 
                            onFocus={this.handleFocus.call(this,"senha")} 
                            handleSubmit={this.handleNext.call(this,"senha")}
                            onChange={value => this.state.user.senha = value} />
                        <FormField 
                            inputRef={this.sInput.call(this, "vSenha")} 
                            label="Digite sua senha novamente" 
                            password={true} 
                            last={true} 
                            shouldNotCapitalize={true} 
                            shouldBlur={true} 
                            onFocus={this.handleFocus.call(this,"vSenha")} 
                            onChange={value => this.state.user.vSenha = value} />
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