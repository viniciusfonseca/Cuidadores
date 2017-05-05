import React from 'react'

import * as Actions from '../Actions'
import { initialState } from '../Reducers'

import { connect } from 'react-redux'
import update from 'immutability-helper'

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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
    return (field == 'cpf' || field == 'telefone')
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
                                props.context.state.user.date = date
                                props.context.forceUpdate()
                            }}
                        />
                    )
                case 'masked':
                    return (
                        <TextInputMask type={props.maskType} underlineColorAndroid="transparent" maxLength={ maskMaxLength[props.maskType] }
                            placeholder={ maskPlaceholders[props.maskType] }
                            blurOnSubmit={!!props.shouldBlur}
                            onSubmitEditing={props.handleSubmit}
                            placeholderTextColor="#CCCCCC"
                            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })} 
                            ref={props.inputRef}
                            onFocus={props.onFocus}
                        />
                    )
                case 'text':
                default:
                    return (
                        <TextInput accessibilityLabel={props.label} underlineColorAndroid="transparent"
                            style={_s("form-section", { 'padding': 0, 'marginBottom': props.last ? 8 : 0 })}
                            onChangeText={props.onChangeText || noop}
                            keyboardType="ascii-capable"
                            returnKeyType="next"
                            secureTextEntry={props.password}
                            ref={props.inputRef}
                            blurOnSubmit={!!props.shouldBlur}
                            onSubmitEditing={props.handleSubmit}
                            onFocus={props.onFocus}
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

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        this.keyboardIsShown = true
    }

    _keyboardDidHide () {
        this.keyboardIsShown = false
    }

    sInput(field) {
        return ref => this.inputHash[field] = ref
    }

    getNextField(field) {
        let flagF = false
        let nextF = null
        Object.keys(this.inputHash).some(sField => {
            if (flagF) {
                nextF = sField
                return true
            }
            flagF = field == sField
        })
        return nextF ? [this.inputHash[nextF], nextF] : [null, null]
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
        }, 50);
    }

    _scrollToInput (nativeElement) {
        setTimeout(() => {
            nativeElement.measure((x, y, w, h, px, py) => {
                Alert.alert('py',py.toString())
                this.refs.scrollView.scrollTo(py)
            })
        }, 0)
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
                    <ScrollView style={{ 'padding': 8 }} ref="scrollView">
                        <View>
                            <RadioForm
                                radio_props={Register.INPUT_CONFIG}
                                animation={false}
                                initial={0}
                                buttonSize={15}
                                buttonOuterSize={30}
                                buttonColor="#000000"
                                onPress={value => {this.state.user.tipo = value;this.forceUpdate()}}
                            />
                        </View>
                        <FormSection label="DADOS PESSOAIS" />
                        <FormField inputRef={this.sInput.call(this, "nome")} label="Nome" onFocus={this.handleFocus.call(this, "nome")} handleSubmit={this.handleNext.call(this,"nome")} />
                        <FormField inputRef={this.sInput.call(this, "cpf")} label="CPF" type="masked" maskType="cpf" shouldBlur={true} onFocus={this.handleFocus.call(this,"cpf")} />
                        <FormField label="Data de nascimento" type="date" context={this} />
                        <FormField inputRef={this.sInput.call(this, "estado")} label="Estado" onFocus={this.handleFocus.call(this,"estado")} handleSubmit={this.handleNext.call(this,"estado")} />
                        <FormField inputRef={this.sInput.call(this, "cidade")} label="Cidade" onFocus={this.handleFocus.call(this,"cidade")} handleSubmit={this.handleNext.call(this,"cidade")} />
                        <FormField inputRef={this.sInput.call(this, "telefone")} label="Telefone" type="masked" maskType="cel-phone" value={this.state.user.telefone} last={true} onFocus={this.handleFocus.call(this,"telefone")} handleSubmit={this.handleNext.call(this,"telefone")} />
                        <FormSection label="DADOS DE AUTENTICAÇÃO" />
                        <FormField inputRef={this.sInput.call(this, "email")} label="Email" shouldNotCapitalize={true} onFocus={this.handleFocus.call(this,"email")} handleSubmit={this.handleNext.call(this,"email")} />
                        <FormField inputRef={this.sInput.call(this, "senha")} label="Senha" password={true} shouldNotCapitalize={true} onFocus={this.handleFocus.call(this,"senha")} handleSubmit={this.handleNext.call(this,"senha")} />
                        <FormField inputRef={this.sInput.call(this, "vSenha")} label="Digite sua senha novamente" password={true} last={true} shouldNotCapitalize={true} shouldBlur={true} onFocus={this.handleFocus.call(this,"vSenha")} />
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