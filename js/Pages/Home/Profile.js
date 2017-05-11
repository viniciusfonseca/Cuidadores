import React from 'react'

import { View } from 'react-native'

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
            </View>
        )
    }
}

const mapStateToProps = state => ({})
const ProfilePage = connect(mapStateToProps)(Profile)

export default ProfilePage