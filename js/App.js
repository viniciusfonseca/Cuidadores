import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, Alert,
  Navigator
} from 'react-native';

import { Provider } from 'react-redux'
import configureStore from './configureStore'

import * as Actions from './Actions'

import Database from './Backend/Database'
import User from './Backend/User'

import LinearGradient from 'react-native-linear-gradient'
import _s, { gradientC } from './Style'

import InitPage from './Pages/Init'
import LoginPage from './Pages/Login'

let store = configureStore()

export const NavBar = props => (
  <LinearGradient style={_s("flex-row flex-stretch", {
    height: props.shouldShowNavBar ? 60 : 0 
  })} colors={gradientC}>

  </LinearGradient>
)

export function noop() {}

class Cuidadores extends React.Component {
  db = null
  navStack = [{
    index: 0,
    title: Actions.PossibleRoutes.INIT
  }]

  constructor(props) {
    super(props)
    this.state = {
      shouldShowNavBar: false
    }
  }

  storeUnsubscribeFnPtr = null

  componentDidMount() {
    this.db = new Database()
    this.user = new User(this.db)
    this.db.init().then(noop, err => {
      Alert.alert("Error", err.message)
    })
    this.storeUnsubscribeFnPtr = store.subscribe(this.onAppStateChange.bind(this))
  }

  componentWillUnmount() {
    if (this.storeUnsubscribeFnPtr != null) {
      this.storeUnsubscribeFnPtr()
    }
  }

  onAppStateChange() {
    let nextState = store.getState()
    if (this.state.shouldShowNavBar !== nextState.shouldShowNavBar) {
      this.setState({
        shouldShowNavBar: nextState.shouldShowNavBar
      })
    }
  }

  navigator = null

  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={nav => this.navigator = nav}
          navigationBar={<NavBar shouldShowNavBar={this.state.shouldShowNavBar}/>}
          initialRouteStack={this.navStack}
          renderScene={route => {
            switch (route.title) {
              case Actions.PossibleRoutes.INIT:
                return <InitPage />
              case Actions.PossibleRoutes.LOGIN:
                return <LoginPage />
            }
          }}/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Cuidadores', () => Cuidadores);
