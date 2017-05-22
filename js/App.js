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

import InitPage            from './Pages/Init'
import LoginPage           from './Pages/Login'
import RegisterPage        from './Pages/Register'
import HomePage            from './Pages/Home'

import ProfilePage         from './Pages/Home/Profile'

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
  },
  [Actions.PossibleRoutes.HOME.PROFILE]: {
    screen: ProfilePage
  },
  [Actions.PossibleRoutes.PROFILE_VIEW]: {
    screen: ProfilePage
  }
}, {
  initialRouteName: Actions.PossibleRoutes.INIT,
  headerMode: 'none'
})

let store = configureStore()

export function noop() {}

class Cuidadores extends React.Component {
  navigator = null

  storeUnsubscribeFnPtr = null

  componentDidMount() {
    this.storeUnsubscribeFnPtr = store.subscribe( this.onAppStateChange.bind(this) )
  }

  componentWillUnmount() {
    if (this.storeUnsubscribeFnPtr != null) {
      this.storeUnsubscribeFnPtr()
    }
  }

  onAppStateChange() {}

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

export const replaceState = (props, routeName, params = {}, action = {}) => {
  let _action = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName, params, action })
    ]
  })
  props.navigation.dispatch(_action)
}

export const navigateTo = (props, stateName, params = {}) => {
  if (params) {
    // Alert.alert("params detected", JSON.stringify(params))
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
