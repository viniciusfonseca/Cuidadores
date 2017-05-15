import React from 'react'

import { 
    View, ScrollView, Text,
    Image
} from 'react-native'
import { TabNavigator } from 'react-navigation'

import { connect } from 'react-redux'

import _s from '../../Style'

import NavBar from '../../Components/NavBar'

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    render() {
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <View style={_s("flex")}>
                    <ScrollView>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({})
const ProfilePage = connect(mapStateToProps)(Profile)


export default ProfilePage