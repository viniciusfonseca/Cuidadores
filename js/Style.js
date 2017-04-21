import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    'row': {
        'flexDirection' : 'row'
    },
    'center-a': {
        'justifyContent' : 'center'
    },
    'end-a': {
        'justifyContent': 'end'
    },
    'center-b': {
        'alignItems' : 'center'
    },
    'stretch': {
        'alignItems' : 'stretch'
    },
    'flex': {
        'flex' : 1
    },

    'gradient-a': {

    },
    'gradient-b': {

    }
})

export default function _s(s) {
    return Object.assign({}, s.split(' ').map(str => style[str]))
}