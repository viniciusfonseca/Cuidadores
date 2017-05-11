import React from 'react'

import {
    View, VirtualizedList, ToastAndroid,
    ActivityIndicator, Text, Alert
} from 'react-native'

import { connect } from 'react-redux'

import _s from '../../Style'

import NavBar from '../../Components/NavBar'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true,
            canLoadMore: false
        }
    }

    componentDidMount() {
        this.fetchData({})
    }

    fetchData = async(params) => {
        let res = null
        try {
            res = this.props.db.fetchData("cuidadores", params)
            this.setState({
                err: 'finish',
                loading: false
            })
            return
        }
        catch (e) {
            Alert.alert("ERR", e.message)
        }
    }

    renderItem({ item, index }) {
        return (
            <View style={_s("flex-row", { 'height': 50 })}>
                <Image source={require('../../img/avatar-large.png')} 
                    style={{ 'height': 40, 'width': 50, 'borderRadius': 20 }}
                    resizeMode="contain" />
                <View style={_s("flex")}>
                    <Text>{item.Nome}</Text>
                    <Text>{item.Telefone}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={_s("flex blank")}>
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
            </View>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db
})
const SearchPage = connect(mapStateToProps)(Search)

export default SearchPage