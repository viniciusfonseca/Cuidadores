import React from 'react'
import {
    View, ScrollView, Text
} from 'react-native'

import { connect } from 'react-redux'

import CheckBox from 'react-native-check-box'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import User from '../../Backend/User'
import { PRESETS_ID } from '../../Backend/QueryPresets'
import * as Actions from '../../Actions'

import NavBar from '../../Components/NavBar'
import SubHeader from '../../Components/SubHeader'

import _s, { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '../../Style'

class Procedures extends React.Component {

    tipoUsuario = null

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            index: 0,
            routes: (() => {
                switch (this.props.user.fields.Tipo) {
                    case User.USER_TYPE.RESPONSAVEL:
                        return [{ key: '2', title: 'Execuções' }]
                    case User.USER_TYPE.CUIDADOR:
                        return [
                            { key: '1', title: 'Procedimentos' },
                            { key: '2', title: 'Execuções' }
                        ]
                }
            })()
        }
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case '1': return <ProceduresTodos />
            case '2': return <ExecStories />
        }
    }

    render() {
        return (
            <View style={_s("flex blank")}>
                <NavBar enableNavBtn={true} navigation={this.props.navigation} />
                <View style={_s("flex",{'zIndex':0})}>
                    
                </View>
            </View>
        )
    }
}

class ProceduresTodos extends React.Component {
    render() {
        return (
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
        )
    }
}

class ExecStories extends React.Component {
    render() {
        return (
            <ScrollView>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => ({
    db: state.db,
    user: state.user
})

const ProceduresPage = connect(mapStateToProps)(Procedures)
export default ProceduresPage