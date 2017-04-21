import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, Alert
} from 'react-native';

// import { Provider } from 'react-redux'

// import { AppNavigator } from './AppNavigator'

import Database from './Backend/Database'

export default class Cuidadores extends React.Component {
  db = null

  componentDidMount() {
    db = new Database()
    db.init().then(function() {
      Alert.alert("Open DB", "Success")
      db.performAuthentication("vfonseca1618@gmail.com").then(function() {
        Alert.alert("Login com sucesso")
      }, function(err) {
        Alert.alert("Login com erro", err.message)
      }).then(function() {
        return db.performAuthentication("emailnaoexiste@gmail.com")
      }).then(function() {
        Alert.alert("Login com sucesso")
      }, function() {
        Alert.alert("Login com erro", err.message)
      })
    }, function(err) {
      Alert.alert("Error", err.message)
    })
  }

  render() {
    return (
        <View>
          <Text>SQLITE TEST</Text>
        </View>
    );
  }
}

AppRegistry.registerComponent('Cuidadores', () => Cuidadores);
