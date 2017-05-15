import React from 'react'

import * as Actions from '../Actions'

import { connect } from 'react-redux'

import {
    View, Text, ScrollView, Image,
    ToastAndroid, ActivityIndicator,
    Alert
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo'

import { DrawerNavigator } from 'react-navigation'

import { navigateTo, noop, replaceState } from '../App'
import ImprovedTouchable from '../Components/ImprovedTouchable'

import SearchPage from './Home/Search'
import ProfilePage from './Home/Profile'

import _s, { gradientC } from '../Style'

const SidemenuOption = props => (
    <ImprovedTouchable onPress={() => props.navigateTo? navigateTo(props, props.navigateTo, props.params || {}): props.onPress()}>
        <View style={_s("flex-row flex-stretch", {'height':40})}>
            <View style={_s("center-a center-b", {'width' :40})}>
                <Icon name={props.name} style={{'fontSize':20}}></Icon>
            </View>
            <View style={_s("flex flex-row center-b")}>
                <Text>{props.label}</Text>
            </View>
        </View>
    </ImprovedTouchable>
)

const getLabelFromUserType = {
    0: 'Procurar Cuidadores',
    1: 'Procurar Dependentes'
}

class Sidemenu extends React.Component {

    promptUserLogout() {
        Alert.alert("Sair da sua conta", "Deseja mesmo sair da sua conta?", [
            {
                text: 'Não',
                onPress: noop
            },
            {
                text: 'Sim',
                onPress: () => {
                    replaceState({
                        navigation: this.props.parentNavigation
                    }, Actions.PossibleRoutes.LOGIN)
                }
            }
        ])
    }

    render() {
        return (
            <View style={_s("flex")}>
                <LinearGradient style={{'position':'relative','height':60,'alignItems':'center','justifyContent':'center'}} colors={gradientC} >
                    <Image source={require('../img/logo.png')} style={{'height':'60%'}} resizeMode="contain"/>
                    <LinearGradient colors={['#AAA','transparent']}
                        style={{'position':'absolute','height':4,'width':'100%','bottom':-4,'left':0,'right':0,'zIndex':1}} />
                </LinearGradient>
                <ScrollView>
                    <SidemenuOption name="magnifying-glass" label={getLabelFromUserType[0]} navigateTo={Actions.PossibleRoutes.HOME.SEARCH}  navigation={this.props.navigation} params={{parentNavigation: this.props.parentNavigation}} />
                    <SidemenuOption name="user"             label="Meu Perfil" navigateTo={Actions.PossibleRoutes.HOME.PROFILE}   navigation={this.props.navigation} />
                    <SidemenuOption name="log-out"          label="Sair" onPress={this.promptUserLogout.bind(this)}/>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})
connect(mapStateToProps)(Sidemenu)

const HomePage = DrawerNavigator({
   [Actions.PossibleRoutes.HOME.SEARCH]: {
       screen: SearchPage,
   },
   [Actions.PossibleRoutes.HOME.PROFILE]: {
       screen: ProfilePage
   }
}, {
    drawerWidth: 255,
    drawerPosition: 'right',
    contentComponent: props => <Sidemenu parentNavigation={props.navigation} {...props} />
})

export default HomePage