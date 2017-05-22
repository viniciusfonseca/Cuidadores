import React from 'react'

import {
    View, VirtualizedList, ToastAndroid,
    ActivityIndicator, Text, Alert, ScrollView,
    Image
} from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal'
import CheckBox from 'react-native-check-box'

import { connect } from 'react-redux'

import _s, { PRIMARY_COLOR } from '../../Style'
import { navigateTo } from '../../App'
import * as Actions from '../../Actions'

import { PRESETS_ID } from '../../Backend/QueryPresets'
import NavBar from '../../Components/NavBar'
import ImprovedTouchable from '../../Components/ImprovedTouchable'
import Button from '../../Components/Button'

function arrayToggleElement(array, element) {
    if (!array.includes(element)) {
        array.push(element)
    }
    else {
        array.splice(array.indexOf(element), 1)
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true,
            canLoadMore: false,
            modalVisible: false,
        }
    }
    especialidades = []
    filters = {
        especialidades: []
    }

    componentDidMount() {
        this.buscaEspecialidades()
        this.fetchData({})
    }

    buscaEspecialidades = async() => {
        let res = null
        try {
            res = await this.props.db.fetchData(PRESETS_ID.ESPECIALIDADES)
            this.especialidades = res.rows
        }
        catch(e) {
            Alert.alert("ERR", e.message)
        }
    }

    fetchData = async params => {
        let res = null
        if (!this.state.loading) {
            this.setState({
                loading: true
            })
        }
        try {
            res = await this.props.db.fetchData(PRESETS_ID.CUIDADORES, params)
            this.setState({
                data: res.rows,
                loading: false
            })
        }
        catch (e) {
            Alert.alert("ERR", e.message)
        }
    }

    clearFilters() {
        this.filters.especialidades = []
    }

    renderFilterModal() {
        return (
            <Modal 
                isVisible={this.state.modalVisible} 
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

    applyFilters() {
        this.setState({
            modalVisible: false
        }, () => {
            this.fetchData({
                especialidades: this.filters.especialidades.join()
            })
        })
    }

    renderItem({ item, index }) {
        return (
            <ImprovedTouchable onPress={this.accessProfile.bind(this, item)} key={item.CodigoUsuario}>
                <View style={_s("flex-row", { 'height': 50, 'padding': 8 })}>
                    <Image source={require('../../img/avatar-large.png')} 
                        style={{ 'height': 40, 'width': 40, 'borderRadius': 20 }}
                        resizeMode="contain" />
                    <View style={_s("flex", { 'marginLeft':8 })}>
                            <Text>{item.Nome}</Text>
                            <Text>{item.Telefone}</Text>
                    </View>
                </View>
            </ImprovedTouchable>
        )
    }

    accessProfile(context) {
        let getK = o => Object.keys(o).toString()
        // Alert.alert("keys", getK(this.props.navigation.state))
        // this.props.parentNavigation.navigate(Actions.PossibleRoutes.HOME.PROFILE)
        navigateTo({
            navigation: this.props.parentNavigation
        }, Actions.PossibleRoutes.PROFILE_VIEW)
    }

    render() {
        return (
            <View style={_s("flex blank")}>
                {this.renderFilterModal.call(this)}
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <View style={_s("flex",{'zIndex':0})}>
                    {!this.state.loading && (this.state.data.length > 0 ? 
                        <VirtualizedList data={this.state.data} 
                            renderItem={this.renderItem.bind(this)}/> : (
                                <View style={_s("center-a center-b",{'height': 50})}>
                                    <Text>Nenhum resultado encontrado.</Text>
                                </View>
                            )
                        )
                    }
                    {this.state.loading &&
                        (<View style={{'paddingVertical':15}}>
                            <ActivityIndicator size={45} />
                        </View>)
                    }
                </View>
                <ActionButton
                    onPress={() => this.setState({ modalVisible: true })}
                    buttonColor={PRIMARY_COLOR}
                    useNativeFeedback={false}
                    icon={<Icon name="funnel" style={{'color':'#FFF','fontSize':30}} />} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db,
    parentNavigation: state.navigation
})
const SearchPage = connect(mapStateToProps)(Search)

export default SearchPage