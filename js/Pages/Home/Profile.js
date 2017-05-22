import React from 'react'

import { 
    View, ScrollView, Text,
    Image, Alert
} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import { connect } from 'react-redux'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

import NavBar from '../../Components/NavBar'

class Profile extends React.Component {
    static get upperSectionStyle() {
        return {
            height: 120, 
            backgroundColor: TERTIARY_COLOR, 
            borderBottomWidth: 1, 
            borderColor: '#DDD',
            padding: 15
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            index: 0,
            routes: [
                {
                    key: '1',
                    title: 'Dependentes'
                },
                {
                    key: '2',
                    title: 'Contratos'
                }
            ]
        }
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case '1':
                return <Dependentes />
            case '2':
                return <Contratos />
        }
    }

    handleChangeTab = index => this.setState({ index })

    render() {
        // Alert.alert("isParentNavigation", String( this.props.navigation == this.props.parentNavigation ))
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <View style={_s("flex")}>
                    <View style={_s("flex-row",Profile.upperSectionStyle)}>
                        <View style={_s("center-a")}>
                            <Image source={require('../../img/avatar-large.png')} 
                                style={{ 'height': 60, 'width': 60, 'borderRadius': 30 }}
                                resizeMode="contain" />
                        </View>
                        <View>
                            <Text>TODO: Info perfil</Text>
                        </View>
                    </View>
                    <TabViewAnimated
                        navigationState={this.state}
                        renderScene={this.renderScene.bind(this)}
                        renderHeader={props => (
                            <TabBar 
                                style={{backgroundColor: SECONDARY_COLOR}} 
                                labelStyle={{color: '#000'}}
                                indicatorStyle={{backgroundColor:PRIMARY_COLOR,height:5}}
                                {...props}/>
                            )}
                        onRequestChangeTab={this.handleChangeTab.bind(this)}/>
                </View>
            </View>
        )
    }
}

class Dependentes extends React.Component {
    render() {
        return <View><Text>TODO: Dependentes</Text></View>
    }
}

class Contratos extends React.Component {
    render() {
        return <View><Text>TODO: Contratos</Text></View>
    }
}

const mapStateToProps = state => ({
    parentNavigation: state.navigation
})
const ProfilePage = connect(mapStateToProps)(Profile)

export default ProfilePage