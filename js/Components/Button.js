import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import _s from '../Style'

const Button = props => (
    <TouchableHighlight onPress={props.onPress} underlayColor="#48ce48" style={_s("button button-a flex-stretch", Object.assign({ 'marginBottom': 20 }, props.style || {}))}>
        <View style={_s("flex center-a center-b")}>
            <Text style={{'color':'#FFF'}}>{props.label}</Text>
        </View>
    </TouchableHighlight>
)

export default Button