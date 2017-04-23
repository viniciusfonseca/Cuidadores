import React from 'react'

import {
    View, ActivityIndicator
} from 'react-native'
import _s from '../Style'

import * as Actions from '../Actions'
import { connect } from 'react-redux'

import LinearGradient from 'react-native-linear-gradient'

export default class Init extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.dispatch(Actions.navigateTo('Login'))
        }, 3000)
    }

    render() {
        return (
            <View style={_s("stretch center-a center-b")}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}

const mapStateToProps = state => {
    location: state.location
}

export const InitPage = connect(mapStateToProps)(InitPage)