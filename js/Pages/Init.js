import React from 'react'

import {
    View, ActivityIndicator
} from 'react-native'
import _s, { gradientA } from '../Style'
import { replaceState } from '../App'

import * as Actions from '../Actions'
import { connect } from 'react-redux'

import LinearGradient from 'react-native-linear-gradient'

class Init extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            replaceState(this.props, Actions.PossibleRoutes.LOGIN)
        }, 3000)
    }

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}>
                <ActivityIndicator size={70} />
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({})

const InitPage = connect(mapStateToProps)(Init)
export default InitPage