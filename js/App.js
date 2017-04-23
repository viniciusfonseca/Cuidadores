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

// import { AppNavigator } from './AppNavigator'

import Database from './Backend/Database'
import User from './Backend/User'

import LinearGradient from 'react-native-linear-gradient'
import _s, { gradientA } from './Style'

let store = configureStore()

const NavBar = () => (
  <LinearGradient style={_s("flex-row flex-stretch", { height: 60 })} colors={gradientA}>

  </LinearGradient>
)

export function noop() {}

export default class Cuidadores extends React.Component {
  db = null
  navStack = [{
    index: 0,
    title: 'init'
  }]

  constructor() {
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
    this.storeUnsubscribeFnPtr()
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
          navigationBar={<NavBar />}
          renderScene={() => {

          }}/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Cuidadores', () => Cuidadores);
