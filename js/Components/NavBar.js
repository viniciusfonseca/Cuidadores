import LinearGradient    from 'react-native-linear-gradient'
import _s, { gradientC } from '../Style'

export const NavBar = props => (
  <LinearGradient style={_s("flex-row flex-stretch", {
    height: 60
  })} colors={gradientC}>
  </LinearGradient>
)