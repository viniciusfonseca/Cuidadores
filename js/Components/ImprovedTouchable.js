import React from 'react'
import { noop } from '../App'
import { TouchableOpacity } from 'react-native'

export default class ImprovedTouchable extends React.Component {
    flagTouch = false
    handleTouch(phase) {
        this.b.setOpacityTo(1,0)
        setTimeout(this.props.onPress)
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} ref={e=>this.b=e}
                onPress={this.handleTouch.bind(this)}
                style={this.props.style}>
                {this.props.children || <View></View>}
            </TouchableOpacity>
        )
    }
}