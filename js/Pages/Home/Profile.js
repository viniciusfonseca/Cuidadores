import React from 'react'

import { 
    View, ScrollView, Text,
    Image, Alert, ActivityIndicator,
    FlatList
} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import { PRESETS_ID } from '../../Backend/QueryPresets'
import User from '../../Backend/User'

import { connect } from 'react-redux'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

import NavBar from '../../Components/NavBar'
import Button from '../../Components/Button'

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
    user = {}

    constructor(props) {
        super(props)
        const params = Object.assign({}, this.props.navigation.state.params)
        this.user.CodigoUsuario = params && params.CodigoUsuario || this.props.user.CodigoUsuario
        this.isVisitingOwnProfile = this.user.CodigoUsuario == this.props.user.CodigoUsuario
        this.state = {
            loading: true,
            index: 0,
            routes: []
        }
    }

    componentDidMount() {
        let parseFields = [
            "Dependentes",
            "Especialidades",
            "Contratos"
        ];
        (async() => {
            let dataUserBackend = (await this.props.db.fetchData(PRESETS_ID.USER_VIEW, {
                CodigoUsuario: this.user.CodigoUsuario
            })).rows[0]
            this.user = Object.assign({}, this.user, dataUserBackend)
            parseFields.forEach(field => {
                this.user[field] = this.user[field] || '[]'
                this.user[field] = JSON.parse(this.user[field])
            })
            let routes = []
            switch (this.user.Tipo) {
                case User.USER_TYPE.RESPONSAVEL:
                    routes = [
                        {
                            key: '1',
                            title: 'Dependentes'
                        },
                        {
                            key: '2',
                            title: 'Contratos'
                        }
                    ]
                    break
                case User.USER_TYPE.CUIDADOR:
                    routes = [
                        {
                            key: '3',
                            title: 'Especialidades'
                        },
                        {
                            key: '2',
                            title: 'Contratos'
                        }
                    ]
            }
            this.setState({ routes }, () => {
                this.setState({ loading: false })
            })
        })()
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case '1':
                return (
                    <Dependentes
                        value={this.user.Dependentes || []} 
                        isVisitingOwnProfile={this.isVisitingOwnProfile}/>
                )
            case '2':
                return (
                    <Contratos
                        value={this.user.Contratos || []} 
                        isVisitingOwnProfile={this.isVisitingOwnProfile} />
                )
            case '3':
                return (
                    <Especialidades 
                        value={this.user.Especialidades || []} 
                        isVisitingOwnProfile={this.isVisitingOwnProfile} />
                )
        }
    }

    handleChangeTab = index => this.setState({ index })

    render() {
        // Alert.alert("isParentNavigation", String( this.props.navigation == this.props.parentNavigation ))
        let user = this.user
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                {this.state.loading ? (
                    <View style={{'paddingVertical':15}}>
                        <ActivityIndicator size={45} />
                    </View>
                ) : (
                    <View style={_s("flex")}>
                        <View style={_s("flex-row",Profile.upperSectionStyle)}>
                            <View style={_s("center-a")}>
                                <Image source={require('../../img/avatar-large.png')} 
                                    style={{ 'height': 60, 'width': 60, 'borderRadius': 30 }}
                                    resizeMode="contain" />
                            </View>
                            <View style={{marginLeft:14}}>
                                <Text>{user.Nome}</Text>
                                <Text>{user.Estado}{user.Cidade?', '+user.Cidade:''}</Text>
                                <Text>Telefone: {user.Telefone}</Text>
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
                )}
            </View>
        )
    }
}

class Dependentes extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={_s("center-a center-b", {height: 85})}>
                <Text style={{textAlign:'center'}}>Você ainda não possui um dependente.</Text>
            </View>
        )
    }
}

class Contratos extends React.Component {
    render() {
        return (
            this.props.value.length == 0 ? (
                this.props.isVisitingOwnProfile ? (
                    <View style={_s("center-a center-b", {height: 85})}>
                        <Text style={{textAlign:'center'}}>Você ainda não possui um contrato.</Text>
                    </View>
                ) : (
                    <View style={_s("center-a center-b", {height: 85})}>
                        <Text style={{textAlign:'center'}}>Você ainda não possui um contrato com este cuidador.</Text>
                    </View>
                )
            ) : (
                <View><Text>TODO: Contratos</Text></View>
            )
        )
    }
}

class Especialidades extends React.Component {
    renderItem( item ) {
        return (
            <View key={item.CodigoUsuario} style={_s("center-a", {height: 40, paddingLeft: 8})}>
                <Text>{item.DescricaoEspecialidade}</Text>
            </View>
        )
    }

    render() {
        return this.props.value.length == 0 ? (
            this.props.isVisitingOwnProfile ? (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Você ainda não possui uma especialidade.</Text>
                    <Button onPress={()=>null} label="ADICIONAR UMA ESPECIALIDADE"></Button>
                </View>
            ) : (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Este cuidador ainda não possui uma especialidade.</Text>
                </View>
            )
        ) : (
            <View style={_s("flex")}>
                <FlatList
                    data={this.props.value}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.CodigoEspecialidade} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    parentNavigation: state.navigation,
    user: state.user,
    db: state.db
})
const ProfilePage = connect(mapStateToProps)(Profile)

export default ProfilePage