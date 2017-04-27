import React from 'react'

import { connect } from 'react-redux'

import {
    View
} from 'react-native'

class Login extends React.Component {
    render() {
        return <View></View>
    }
}

const mapStateToProps = state => ({
    
})

const LoginPage = connect(mapStateToProps)(Login)
export default LoginPage