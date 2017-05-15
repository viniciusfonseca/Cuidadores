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

    'blank': {
        'backgroundColor': '#FFFFFF'
    },

    'login-input': {
        'height' : 40,
        'width' : '100%',
        'backgroundColor': '#FFFFFF',
        'borderRadius': 30,
        'margin': 7,
        'paddingHorizontal': 8,
        'borderWidth': 1,
        'borderStyle': 'solid',
        'borderColor': '#EFEFEF'
    },

    'button': {
        'height': 40,
        'borderRadius': 20,
        'borderWidth': 1,
        'borderStyle': 'solid',
        'borderColor': '#DDDDDD',
    },
    'button-a': {
        'backgroundColor': '#4fe24f'
    },

    'logo-circle': {
        'backgroundColor': '#FFFFFF',
        'height': 110,
        'width': 110,
        'borderRadius': 55,
        'borderWidth': 4,
        'borderColor': '#F9F9F9'
    },
    'sm': {
        'height': 44,
        'width': 44,
        'borderRadius': 22,
        'borderWidth': 2,
    },

    'subheader': {
        'height': 50,
        'backgroundColor': '#d8f7d5',
        'padding': 10,
        'borderBottomWidth': 1,
        'borderColor': '#DDDDDD'
    },

    'form-section': {
        'borderBottomWidth': 1,
        'borderColor': '#DDDDDD'
    },
}

export const gradientA = ['#FFFFFF','#74FD71']
export const gradientB = ['#c1fbbf','#2db72d']
export const gradientC = ['#def7e4','#8de589']

export const PRIMARY_COLOR = "#48ce48"
export const SECONDARY_COLOR = "#94ef94"

export default function _s(s, o) {
    return Object.assign.apply(
        Object, 
        [{}].concat(
            s.split(' ')
            .map(str => style[str])
            .filter(Boolean)
        ).concat(o || {})
    )
}