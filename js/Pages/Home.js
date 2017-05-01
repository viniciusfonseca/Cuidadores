import React from 'react'

import * as Actions from '../Actions'

import { connect } from 'react-redux'

import {
    View, Text, ScrollView, 
    ToastAndroid, ActivityIndicator,
    DrawerLayoutAndroid
} from 'react-native'

import NavBar from '../Components/NavBar'
import SubHeader from '../Components/SubHeader'
import Spinner from '../Components/Spinner'

import _s from '../Style'

class Sidemenu extends React.Component {
    render() {
        return (
            <View style={_s("flex")}>
            </View>
        )
    }
}

class Home extends React.Component {
    sidemenu = null

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <DrawerLayoutAndroid
                ref={e=>this.sidemenu=e}
                drawerWidth={240}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                renderNavigationView={() => <Sidemenu />}>
                <View style={_s("flex blank")}>
                    <NavBar />
                </View>
            </DrawerLayoutAndroid>
        )
    }
}

const mapStateToProps = state => ({})
const HomePage = connect(mapStateToProps)(Home)

export default HomePage