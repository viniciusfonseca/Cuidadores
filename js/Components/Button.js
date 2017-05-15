import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import _s from '../Style'

const Button = props => (
    <TouchableHighlight onPress={props.onPress} underlayColor="#48ce48" style={_s("button flex button-a flex-stretch", { 'marginBottom': 20 })}>
        <View style={_s("flex center-a center-b")}>
            <Text style={{'color':'#FFF'}}>{props.label}</Text>
        </View>
    </TouchableHighlight>
)

export default Button