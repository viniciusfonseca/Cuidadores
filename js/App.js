import React             from 'react'
import {
  AppRegistry, Text, View,
  Alert,       Navigator,
  BackAndroid
}                        from 'react-native';

import { Provider }      from 'react-redux'
import configureStore    from './configureStore'

import * as Actions      from './Actions'

import Database          from './Backend/Database'
import User              from './Backend/User'

import InitPage          from './Pages/Init'
import LoginPage         from './Pages/Login'

let store = configureStore()

export function noop() {}

class Cuidadores extends React.Component {
  db = null
  navStack = [{
    index: 0,
    title: Actions.PossibleRoutes.INIT
  }]
  lastNav = 0
  navigator = null

  constructor(props) {
    super(props)
    this.state = {
      shouldShowNavBar: false
    }
    BackAndroid.addEventListener("hardwareBackPress", () => {
      if (this.navStack.length > 1) {
        this.navigator.pop()
        return true
      }
      return false
    })
  }

  storeUnsubscribeFnPtr = null

  componentDidMount() {
    this.db = new Database()
    this.user = new User(this.db)
    this.db.init().then(noop, err => {
      Alert.alert("Error", err.message)
    })
    this.storeUnsubscribeFnPtr = store.subscribe( this.onAppStateChange.bind(this) )
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
    console.log("*** LOG: WILL VERIFY NEXTSTATE LOCATION ***")
    console.log( JSON.stringify(nextState) )
    console.log("*** ***")
    if (nextState.location && this.lastNav !== nextState.location.lastNav) {
      this.lastNav = nextState.location.lastNav
      this.handleNavigation(nextState.location)
    }
  }

  handleNavigation(locationPtr) {
    console.log("*** LOG: CALL HANDLE NAVIGATION")
    if (!locationPtr.name) {
      return
    }
    if (locationPtr.index < 0) {
      this.navigator.popN(-locationPtr.index)
      return
    }
    let nextRoute = this.castActionAsRoute(locationPtr)
    if (locationPtr.params.$replace) {
      console.log("*** LOG NEXT ROUTE ***\n" + JSON.stringify(nextRoute) )
      this.navigator.replace(nextRoute)
    }
    else {
      this.navigator.push(nextRoute)
    }
  }

  castActionAsRoute(action) {
    return {
      title: action.name,
      index: this.getLastRouteIndex()
    }
  }

  getLastRouteIndex() {
    return this.navStack[ this.navStack.length - 1 ].index || 0
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={nav => this.navigator = nav}
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
