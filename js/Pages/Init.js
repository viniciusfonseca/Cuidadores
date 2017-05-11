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
        }, 700)
    }

    render() {
        return (
            <LinearGradient style={_s("flex flex-stretch center-a center-b")} colors={gradientA}
                onLayout={e=>1}>
                <ActivityIndicator size={70} />
            </LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db
})

const InitPage = connect(mapStateToProps)(Init)
export default InitPage