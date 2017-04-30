import React from 'react'

import {
    View, Text
} from 'react-native'

import _s from '../Style'

const SubHeader = props => (
    <View style={_s("subheader center-a")}>
        <Text>{props.label}</Text>
    </View>
)
export default SubHeader