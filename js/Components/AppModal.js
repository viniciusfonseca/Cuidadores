// -----------------------------------------------------------------
// TODO: Write Modal component to be presented in Login.js, Search.js
// -----------------------------------------------------------------

import React from 'react'
import Modal from 'react-native-modal'

export default class AppModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state.modalVisible = this.props.modalVisible
    }

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>{this.titulo}</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    {this.props.children}
                </View>
            </Modal>
        )
    }
}