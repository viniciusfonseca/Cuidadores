import React from 'react'

import {
    View, ActivityIndicator, Alert, AsyncStorage
} from 'react-native'
import _s, { gradientA } from '../Style'
import { replaceState, navigateTo } from '../App'

import * as Actions from '../Actions'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

import User from '../Backend/User'
import Database from '../Backend/Database'

import LinearGradient from 'react-native-linear-gradient'

class Init extends React.Component {

    componentDidMount() {
        (async () => {
            let action = Actions.assignStackNavigation(this.props.navigation)
            this.props.dispatch(action)

            let db = new Database()
            await db.init()
            action = Actions.assignDB(db)
            this.props.dispatch(action)

            let user = new User(db)
            await user.init()
            action = Actions.assignUser(user)
            this.props.dispatch(action)

            this.initialize()
        })()
    }

    initialize() {
        setTimeout(() => {
            let userStat = this.props.user.getStatus()
            let isFilled = userStat == User.STATUS.INITIATED_FILLED

            if( !isFilled ) {
                replaceState(this.props, Actions.PossibleRoutes.LOGIN)
            }
            else {
                replaceState(this.props, Actions.PossibleRoutes.HOME_)
            }
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