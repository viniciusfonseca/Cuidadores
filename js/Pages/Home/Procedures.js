import React from 'react'
import {
    View, ScrollView, Text
} from 'react-native'

import { connect } from 'react-redux'

import CheckBox from 'react-native-check-box'

import User from '../../Backend/User'
import { PRESETS_ID } from '../../Backend/QueryPresets'
import * as Actions from '../../Actions'

import NavBar from '../../Components/NavBar'
import SubHeader from '../../Components/SubHeader'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

class Procedures extends React.Component {
    render() {
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <View style={_s("flex",{'zIndex':0})}>
                    <ScrollView style={{'padding':8}}>
                        <View>
                            <View style={_s("flex-row center-b",{'marginVertical':5})}>
                                <Text style={_s("flex",{'fontWeight':'bold'})}>Dependente X</Text>
                            </View>
                            <View>
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Fazer exercícios" />
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Tomar remédios" />
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Tomar sol"/>
                            </View>
                            <View style={_s("flex-row center-b",{'marginVertical':5})}>
                                <Text style={_s("flex",{'fontWeight':'bold'})}>Dependente Y</Text>
                            </View>
                            <View>
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Realizar caminhada" />
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Tomar remédios" />
                                <CheckBox
                                    style={{flex: 1, padding: 10, borderBottomWidth:1, borderColor: '#DEDEDE'}}
                                    onClick={()=> null}
                                    leftText="Tomar vitamina"/>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db,
    user: state.user
})

const ProceduresPage = connect(mapStateToProps)(Procedures)
export default ProceduresPage