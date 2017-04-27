import React from 'react'

import {
    View, ActivityIndicator
} from 'react-native'
import _s, { gradientA } from '../Style'

import * as Actions from '../Actions'
import { connect } from 'react-redux'

import LinearGradient from 'react-native-linear-gradient'

class Init extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.dispatch(Actions.navigateTo(Actions.PossibleRoutes.LOGIN))
        }, 3000)
    }

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}>
                <ActivityIndicator size="large" />
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    location: state.location
})

const InitPage = connect(mapStateToProps)(Init)
export default InitPage