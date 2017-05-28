import React from 'react'

import User from '../Backend/User'
import { PRESETS_ID } from '../Backend/QueryPresets'
import * as Actions from '../Actions'

import { connect } from 'react-redux'

import ReactNative, {
    View, Text, TextInput, 
    TouchableHighlight, 
    Alert, Image, ScrollView, 
    ToastAndroid, Keyboard
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationActions } from 'react-navigation'

import _s, { gradientA } from '../Style'
import { noop, replaceState } from '../App'

import NavBar from '../Components/NavBar'
import SubHeader from '../Components/SubHeader'
import Spinner from '../Components/Spinner'
import Button from '../Components/Button'

import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'

import { TextInputMask } from 'react-native-masked-text'

import { TestaCPF } from '../Utils'

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
                                    date={this.props.value}
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
                                    onDateChange={this.props.onChange}
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
                                    ref={el => {
                                        this.maskedInputRef = el
                                        this.props.inputRef(el)
                                    }}
                                    onFocus={this.props.onFocus}
                                    onBlur={() => this.props.onChange(this.maskedInputRef.getRawValue())}
                                />
                            )
                        case 'text':
                        default:
                            return (
                                <TextInput accessibilityLabel={this.props.label} 
                                    underlineColorAndroid="transparent"
                                    style={_s("form-section", { 'padding': 0, 'marginBottom': this.props.last ? 8 : 0 })}
                                    onChangeText={this.props.onChange || noop}
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

class Register extends React.Component {

    static get FIELD_NAMES() {
        return {
            Nome:       'Nome',
            CPF:        'CPF',
            DataNascimento: 'Data de nascimento',
            Estado:     'Estado',
            Cidade:     'Cidade',
            Telefone:   'Telefone',
            Email:      'E-mail',
            Senha:      'Senha',
            vSenha:     'Confirmação de senha'
        }
    }

    inputHash = {}

    constructor(props) {
        super(props)
        this.state = {
            registering: false,
            user: Object.assign({}, (() => {
                let o = {}
                Object.keys(User.INITIAL_STATE).forEach(key => o[key] = '')
                o.vSenha = ''
                o.Tipo = 0
                return o
            })())
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

    registerUser = async() => {
        let cadData = {}, vSenha = null
        let userData = Object.assign({}, this.state.user)
        delete userData.userService
        // Alert.alert("userData",JSON.stringify(userData))
        for (let [k, v] of Object.entries(userData)) {
            if (!(k in User.INITIAL_STATE)) {
                continue
            }
            v = v || ""
            v = v.trim()
            if (!v) {
                ToastAndroid.show("O seguinte campo está vazio: " + Register.FIELD_NAMES[k], ToastAndroid.SHORT)
                return
            }
            if (k === 'cpf' && !TestaCPF(v)) {
                ToastAndroid.show("Informe um CPF válido", ToastAndroid.SHORT)
                return
            }
            userData[k] = v
        }
        if (this.state.user.Senha !== this.state.user.vSenha) {
            ToastAndroid.show("Confirme a sua senha corretamente", ToastAndroid.SHORT)
            return
        }

        delete userData.vSenha
        
        this.setState({ registering: true })

        let userExists = Boolean((await this.props.db.fetchData( PRESETS_ID.USER_EXISTS, { email: userData.Email })).rows[0].R)

        if (userExists) {
            this.setState({ registering: false })
            ToastAndroid.show("Já existe um usuário cadastrado com este endereço de email", ToastAndroid.SHORT)
            return
        }
        await this.props.db.fetchData(PRESETS_ID.CREATE_USER, userData)
        let dadosUsuarioBackend = (await this.props.db.fetchData(PRESETS_ID.RETRIEVE_USER, {
            email: userData.Email,
            pass: userData.Senha
        }))[0]
        await this.props.user.write( dadosUsuarioBackend )

        this.setState({ registering: false })
        ToastAndroid.show("Cadastro realizado com sucesso", ToastAndroid.SHORT)
        replaceState(this.props, Actions.PossibleRoutes.HOME_, {}, NavigationActions({
            routeName: Actions.PossibleRoutes.HOME.PROFILE,
            params: { CodigoUsuario: dadosUsuarioBackend.CodigoUsuario }
        }))
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
                            onPress={value => this.state.user.Tipo = value} />
                        <FormSection label="DADOS PESSOAIS" />
                        <FormField
                            inputRef={this.sInput.call(this, "nome")} 
                            label="Nome" 
                            onFocus={this.handleFocus.call(this, "nome")} 
                            handleSubmit={this.handleNext.call(this,"nome")} 
                            onChange={value => this.state.user.Nome = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "cpf")}
                            label="CPF" 
                            type="masked" 
                            maskType="cpf"
                            shouldBlur={true} onFocus={this.handleFocus.call(this,"cpf")}
                            onChange={value => this.state.user.CPF = value} />
                        <FormField
                            label="Data de nascimento" 
                            type="date"
                            value={this.state.user.DataNascimento}
                            onChange={v => {this.state.user.DataNascimento = v; this.forceUpdate()}} />
                        <FormField
                            inputRef={this.sInput.call(this, "estado")} 
                            label="Estado" 
                            onFocus={this.handleFocus.call(this,"estado")} 
                            handleSubmit={this.handleNext.call(this,"estado")}
                            onChange={value => this.state.user.Estado = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "cidade")}
                            label="Cidade" 
                            onFocus={this.handleFocus.call(this,"cidade")} 
                            handleSubmit={this.handleNext.call(this,"cidade")}
                            onChange={value => this.state.user.Cidade = value} />
                        <FormField
                            inputRef={this.sInput.call(this, "telefone")} 
                            label="Telefone" 
                            type="masked" 
                            maskType="cel-phone" 
                            last={true}
                            shouldBlur={true}
                            onFocus={this.handleFocus.call(this,"telefone")}
                            onChange={value => this.state.user.Telefone = value} />
                        <FormSection label="DADOS DE AUTENTICAÇÃO" />
                        <FormField
                            inputRef={this.sInput.call(this, "email")} 
                            label="Email" 
                            shouldNotCapitalize={true} 
                            onFocus={this.handleFocus.call(this,"email")} 
                            handleSubmit={this.handleNext.call(this,"email")}
                            onChange={value => this.state.user.Email = value} />
                        <FormField 
                            inputRef={this.sInput.call(this, "senha")} 
                            label="Senha" 
                            password={true} 
                            shouldNotCapitalize={true} 
                            onFocus={this.handleFocus.call(this,"senha")} 
                            handleSubmit={this.handleNext.call(this,"senha")}
                            onChange={value => this.state.user.Senha = value} />
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
    db: state.db,
    user: state.user
})
const RegisterPage = connect(mapStateToProps)(Register)
export default RegisterPage