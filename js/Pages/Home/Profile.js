import React from 'react'

import { View } from 'react-native'

import { connect } from 'react-redux'

class Profile extends React.Component {
    render() {
        return (
            <View></View>
        )
    }
}

const mapStateToProps = state => ({})
const ProfilePage = connect(mapStateToProps)(Profile)

export default ProfilePage