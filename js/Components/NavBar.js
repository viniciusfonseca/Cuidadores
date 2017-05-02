import React from 'react'
import {
  View, Image, TouchableOpacity
} from 'react-native'
import { noop, navigateBack } from '../App'

import LinearGradient    from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Entypo'
import _s, { gradientC } from '../Style'

const NavBar = props => (
  <LinearGradient style={_s("flex-row center-b", {
    height: 60,
    position: 'relative'
  })} colors={gradientC}>
    <View style={_s("flex")}>
      {props.enableBackBtn && (
      <TouchableOpacity onPress={navigateBack(props)}
        style={{'width':50}}>
        <Icon name="chevron-left" color="#555" style={{'fontSize':44}} />
      </TouchableOpacity>)}
    </View>
    <View style={_s("center-b logo-circle sm",{'padding':6})}>
      <Image style={_s("flex")} resizeMode="contain" source={require('../img/cross.png')}/>
    </View>
    <View style={_s("flex")}></View>
    <LinearGradient colors={['#AAA','transparent']}
      style={{'position':'absolute','height':4,'width':'100%','bottom':-4,'zIndex':1}} />
  </LinearGradient>
)
export default NavBar