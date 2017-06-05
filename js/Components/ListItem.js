import React from 'react'
import { Text, View } from 'react-native'
import _s from '../Style'

const ListItem = props => (
    <View style={_s("center-a", {height: 50, paddingLeft: 8, borderColor:'#DDD',borderBottomWidth:1})}>
        <Text>{props.label}</Text>
    </View>
)
export default ListItem