import React from 'react'

import {
    View, ActivityIndicator
} from 'react-native'
import { _s } from '../Style'

export default class InitPage extends React.Component {
    componentDidMount() {
        setTimeout(() => {

        }, 3000)
    }

    render() {
        return (
            <View style={_s("stretch center-a center-b")}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}