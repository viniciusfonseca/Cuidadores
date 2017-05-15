import React from 'react'

import {
    View, ActivityIndicator
} from 'react-native'
import _s, { gradientA } from '../Style'
import { replaceState } from '../App'

import * as Actions from '../Actions'
import { connect } from 'react-redux'

import User from '../Backend/User'

import LinearGradient from 'react-native-linear-gradient'

class Init extends React.Component {

    componentDidMount() {
        initialize()
    }

    initialize = async() => {
        let { user } = this.props
        await user.init()
        let userStat = user.getStatus()
        let isFilled = userStat == User.STATUS.INITIATED_FILLED
        setTimeout(() => {
            replaceState(this.props, 
                isFilled? 
                    Actions.PossibleRoutes.LOGIN : 
                    Actions.PossibleRoutes.HOME_
            )
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
    db: state.db,
    user: user.state
})

const InitPage = connect(mapStateToProps)(Init)
export default InitPage