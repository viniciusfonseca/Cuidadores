import React from 'react'

import { View, VirtualizedList } from 'react-native'

import { connect } from 'react-redux'

import _s from '../../Style'

import NavBar from '../../Components/NavBar'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    render() {
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <VirtualizedList>
                </VirtualizedList>
            </View>
        )
    }
}

const mapStateToProps = state => ({})
const SearchPage = connect(mapStateToProps)(Search)

export default SearchPage