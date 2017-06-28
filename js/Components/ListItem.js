import React from 'react'
import { Text, View } from 'react-native'
import _s from '../Style'
import { noop } from '../App'
import ImprovedTouchable from './ImprovedTouchable'

const ListItem = props => (
    <ImprovedTouchable onPress={props.onPress || noop}>
        <View style={_s("flex-row center-b", Object.assign({minHeight: 50, paddingLeft: 8, borderColor:'#DDD',borderBottomWidth:1}))}>
            {props.label ? <Text style={_s("flex")}>{props.label}</Text> : null}
            {props.children}
        </View>
    </ImprovedTouchable>
)
export default ListItem