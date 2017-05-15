import React               from 'react'
import {
  AppRegistry, Text, View,
  Alert, BackAndroid, ToastAndroid
}                          from 'react-native'
import {
  StackNavigator,
  NavigationActions
}                          from 'react-navigation'

import { Provider }        from 'react-redux'
import configureStore      from './configureStore'

import * as Actions        from './Actions'

import Database            from './Backend/Database'
import User                from './Backend/User'

import InitPage            from './Pages/Init'
import LoginPage           from './Pages/Login'
import RegisterPage        from './Pages/Register'
import HomePage            from './Pages/Home'

const Navigator = StackNavigator({
  [Actions.PossibleRoutes.INIT]: {
    screen: InitPage
  },
  [Actions.PossibleRoutes.LOGIN]: {
    screen: LoginPage
  },
  [Actions.PossibleRoutes.REGISTER]: {
    screen: RegisterPage
  },
  [Actions.PossibleRoutes.HOME_]: {
    screen: HomePage
  }
}, {
  initialRouteName: Actions.PossibleRoutes.INIT,
  headerMode: 'none'
})

let store = configureStore()

export function noop() {}

class Cuidadores extends React.Component {
  db = null
  navigator = null

  constructor(props) {
    super(props)
    this.state = {
      shouldShowNavBar: false
    }
    // Alert.alert("start","start")
    // BackAndroid.addEventListener("hardwareBackPress", () => {
    //   console.log("*** LOG: navStack.length - " + this.navStack.length + " ***")
    //   if (this.navStack.length > 1) {
    //     this.navigator.pop()
    //     this.navStack.pop()
    //     return true
    //   }
    //   return false
    // })
  }

  storeUnsubscribeFnPtr = null

  componentDidMount() {
    this.db = new Database()
    this.user = new User(this.db)
    this.db.init()

    let action = Actions.assignDB(this.db)
    store.dispatch(action)

    action = Actions.updateUserData({
      userService: this.user
    })
    store.dispatch(action)

    this.storeUnsubscribeFnPtr = store.subscribe( this.onAppStateChange.bind(this) )
  }

  componentWillUnmount() {
    if (this.storeUnsubscribeFnPtr != null) {
      this.storeUnsubscribeFnPtr()
    }
  }

  onAppStateChange() {
    
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={nav => this.navigator = nav}
        />
      </Provider>
    );
  }
}

export const navigateBack = (props) => {
  let action = NavigationActions.back()
  props.navigation.dispatch(action)
}

export const replaceState = (props, routeName) => {
  let action = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName })
    ]
  })
  props.navigation.dispatch(action)
}

export const navigateTo = (props, stateName, params = {}) => {
  if (params) {
    Alert.alert("params detected", JSON.stringify(params))
  }
  let action = NavigationActions.navigate({
    routeName: stateName,
    params
  })
  props.navigation.dispatch(action)
}

export const openDrawer = props => {
  props.navigation.navigate('DrawerOpen')
}

export const closeDrawer = props => {
  props.navigation.navigate('DrawerClose')
}

AppRegistry.registerComponent('Cuidadores', () => Cuidadores);
