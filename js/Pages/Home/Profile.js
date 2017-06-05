import React from 'react'

import { 
    View, ScrollView, Text,
    Image, Alert, ActivityIndicator,
    FlatList
} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import LinearGradient from 'react-native-linear-gradient'
import { MaskService } from 'react-native-masked-text'

import { PRESETS_ID } from '../../Backend/QueryPresets'
import User from '../../Backend/User'

import { connect } from 'react-redux'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

import NavBar, { NavBarShadow } from '../../Components/NavBar'
import Button from '../../Components/Button'
import ListItem from '../../Components/ListItem'

class Profile extends React.Component {
    static get upperSectionStyle() {
        return {
            minHeight: 120, 
            backgroundColor: TERTIARY_COLOR, 
            borderBottomWidth: 1, 
            borderColor: '#DDD',
            paddingTop: 15,
            paddingHorizontal: 15,
            position: 'relative',
            zIndex: 0
        }
    }
    user = {}

    constructor(props) {
        super(props)
        const params = Object.assign({}, this.props.navigation.state.params)
        this.user.CodigoUsuario = params && params.CodigoUsuario || this.props.user.getCodigoUsuario()
        this.isVisitingOwnProfile = this.user.CodigoUsuario == this.props.user.getCodigoUsuario()
        this.asStack = Boolean(params.asStack)
        this.state = {
            loading: true,
            index: 0,
            routes: [],

            modalDependentesVisible: false
        }
    }

    componentDidMount() {
        let parseFields = [
            "Dependentes",
            "Especialidades",
            "Contratos"
        ];
        (async() => {
            // Alert.alert("user", JSON.stringify( this.props.user.fields ))
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

    static get SUBVIEW_PROPS() {
        return {
            "Dependentes": {},
            "Contratos": {},
            "Especialidades": {}
        }
    }

    renderScene = ({ route }) => {
        let componentClass = null, key = ""
        switch (route.key) {
            case '1': componentClass = Dependentes;    key = "Dependentes";    break
            case '2': componentClass = Contratos;      key = "Contratos";      break
            case '3': componentClass = Especialidades; key = "Especialidades"; break
        }
        return React.createElement(componentClass, Object.assign({
            value: this.user[ key ],
            isVisitingOwnProfile: this.isVisitingOwnProfile
        }, Profile.SUBVIEW_PROPS[ key ]))
    }

    handleChangeTab = index => this.setState({ index })

    renderDependentesModal() {
        return (
            <Modal 
                isVisible={this.state.modalDependentesVisible} 
                animationIn="fadeInUp" 
                animationOut="fadeOutDown">
                <View style={_s("flex blank", { 'borderRadius': 9, 'margin': 12 })}>
                    <View style={_s("subheader flex-stretch flex-row", { 'borderTopLeftRadius': 9, 'borderTopRightRadius': 9, 'padding': 0 })}>
                        <View style={_s("flex flex-row center-b",{'paddingLeft': 8})}>
                            <Text style={{ 'fontWeight': 'bold', 'fontSize': 16 }}>Filtrar resultados</Text>
                        </View>
                        <ImprovedTouchable onPress={() => this.setState({ modalVisible: false })}>
                            <View style={_s("center-a center-b",{'width':50, 'height':'100%',})}>
                                <Icon name="circle-with-cross" style={{'fontSize':26,'color':'#000',}} />
                            </View>
                        </ImprovedTouchable>
                    </View>
                    <ScrollView style={{'padding':8}}>
                        <View style={_s("flex-row center-b",{'marginBottom':8})}>
                            <Text style={_s("flex",{'fontWeight':'bold'})}>Especialidades</Text>
                        </View>
                        {
                            this.especialidades.map(especPtr => (
                                <CheckBox
                                    key={especPtr.CodigoEspecialidade}
                                    style={{flex: 1, padding: 10}}
                                    onClick={()=> {
                                        arrayToggleElement(
                                            this.filters.especialidades,
                                            especPtr.CodigoEspecialidade)
                                    }}
                                    isChecked={this.filters.especialidades.includes(especPtr.CodigoEspecialidade)}
                                    leftText={especPtr.DescricaoEspecialidade}/> )
                            )
                        }
                        <Button label="Aplicar filtros" onPress={this.applyFilters.bind(this)} />
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render() {
        let user = this.user
        // Alert.alert("user", JSON.stringify( user ))
        return (
            <View style={_s("flex blank")}>
                <NavBar
                    enableBackBtn={this.asStack}
                    enableNavBtn={!this.asStack}
                    navigation={this.props.navigation}
                    parentNavigation={this.props.parentNavigation} />
                <NavBarShadow />
                {this.state.loading ? (
                    <View style={{'paddingVertical':15}}>
                        <ActivityIndicator size={45} />
                    </View>
                ) : (
                    <View style={_s("flex")}>
                        <View style={_s("flex-row", Profile.upperSectionStyle)}>
                            <View style={_s("center-a")}>
                                <Image source={require('../../img/avatar-large.png')} 
                                    style={{ 'height': 60, 'width': 60, 'borderRadius': 30 }}
                                    resizeMode="contain" />
                            </View>
                            <View style={{marginLeft:14}}>
                                <Text>{user.Nome}</Text>
                                <Text style={{marginVertical: 2}}>{user.Localizacao}</Text>
                                <Text>Telefone: {MaskService.toMask('cel-phone', user.Telefone, {})}</Text>
                                {this.isVisitingOwnProfile? (
                                    <View style={{marginTop:6}}>
                                        <Button label="Editar perfil" />
                                    </View>
                                ): (() => {
                                    switch (this.user.Tipo) {
                                        case User.USER_TYPE.RESPONSAVEL:
                                            return (
                                                <View style={{marginTop:6}}>
                                                    <Button label="Oferecer serviço" />
                                                </View>
                                            )
                                        case User.USER_TYPE.CUIDADOR:
                                            return (
                                                <View style={{marginTop:6}}>
                                                    <Button label="Contratar cuidador" />
                                                </View>
                                            )
                                    }
                                })}
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
        return this.props.value.length == 0? (
            <View style={_s("center-a center-b", {height: 85})}>
                <Text style={{'textAlign':'center'}}>Você ainda não possui um dependente.</Text>
                <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                    Clique para adicionar um dependente
                </Text>
            </View>
        ): (
            <ScrollView>

            </ScrollView>
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
                <View>
                    <Text>TODO: Contratos</Text>
                </View>
            )
        )
    }
}

class Especialidades extends React.Component {
    renderItem({ item }) {
        return <ListItem label={item.DescricaoEspecialidade} />
    }

    render() {
        return this.props.value.length == 0 ? (
            this.props.isVisitingOwnProfile ? (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Você ainda não possui uma especialidade.</Text>
                    <Text style={{'textDecorationLine':'underline','marginTop':5}}>
                        Clique para adicionar uma especialidade
                    </Text>
                </View>
            ) : (
                <View style={_s("center-a center-b", {height: 85})}>
                    <Text style={{textAlign:'center'}}>Este cuidador ainda não possui uma especialidade.</Text>
                </View>
            )
        ) : (
            <View style={_s("flex", {paddingHorizontal:12})}>
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