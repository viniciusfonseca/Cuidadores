import React from 'react'
import { Text, View } from 'react-native'
import _s from '../Style'
import { noop } from '../App'
import ImprovedTouchable from './ImprovedTouchable'

const ListItem = props => (
    <ImprovedTouchable onPress={props.onPress || noop}>
        <View style={_s("flex-row center-b", {height: 50, paddingLeft: 8, borderColor:'#DDD',borderBottomWidth:1})}>
            <Text style={_s("flex")}>{props.label}</Text>
            {props.children}
        </View>
    </ImprovedTouchable>
)
export default ListItem