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
        let { hitSlop } = this.props || 0
        hitSlop = {
            top: hitSlop,
            left: hitSlop,
            right: hitSlop,
            bottom: hitSlop
        }
        return (
            <TouchableOpacity activeOpacity={0.5} ref={e=>this.b=e}
                onPress={this.handleTouch.bind(this)}
                style={this.props.style}
                hitSlop={hitSlop}>
                {this.props.children || <View></View>}
            </TouchableOpacity>
        )
    }
}