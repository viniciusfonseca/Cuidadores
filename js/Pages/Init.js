import React from 'react'

import {
    View, ActivityIndicator, Alert
} from 'react-native'
import _s, { gradientA } from '../Style'
import { replaceState } from '../App'

import * as Actions from '../Actions'
import { connect } from 'react-redux'

import User from '../Backend/User'

import LinearGradient from 'react-native-linear-gradient'

class Init extends React.Component {

    componentDidMount() {
        this.initialize()
    }

    initialize() {
        setTimeout(() => {
            (async() => {
                let user = new User(this.props.db)
                let action = Actions.assignUser(user)
                this.props.dispatch(action)

                // const getK = o => Object.keys(o).toString()
                // Alert.alert("keys",getK(user))
                try {
                    await user.init()
                } catch (e) {
                    Alert.alert("ERR",JSON.stringify(e.message))
                }
                let userStat = user.getStatus()
                let isFilled = userStat == User.STATUS.INITIATED_FILLED
                replaceState(this.props, 
                    !isFilled? 
                        Actions.PossibleRoutes.LOGIN : 
                        Actions.PossibleRoutes.HOME_
                )
            })()
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
    user: state.user
})

const InitPage = connect(mapStateToProps)(Init)
export default InitPage