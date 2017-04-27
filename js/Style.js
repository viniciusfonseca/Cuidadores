import { StyleSheet } from 'react-native'

const style = {
    'flex-row': {
        'flexDirection' : 'row'
    },
    'center-a': {
        'justifyContent' : 'center'
    },
    'end-a': {
        'justifyContent': 'flex-end'
    },
    'center-b': {
        'alignItems' : 'center'
    },
    'flex-stretch': {
        'alignItems' : 'stretch'
    },
    'flex': {
        'flex' : 1
    },
}

export const gradientA = ['#FFFFFF','#74FD71']
export const gradientB = ['#c1fbbf','#2db72d']
export const gradientC = ['#def7e4','#8df589']

export default function _s(s, o) {
    return Object.assign.apply(Object, [{}].concat(s.split(' ').map(str => style[str]).filter(Boolean)).concat(o || {}))
}