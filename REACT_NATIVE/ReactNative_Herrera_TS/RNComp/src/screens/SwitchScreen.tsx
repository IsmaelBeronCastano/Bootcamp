import React from 'react'
import { View } from 'react-native'
import SwitchComponent from '../components/SwitchComponent'
import HeaderTitle from '../components/HeaderTitle'
const SwitchScreen = () => {
  return (
    <View style={{marginHorizontal: 20}}>
      <HeaderTitle title="Switches" />
      <SwitchComponent />
    </View>
  )
}

export default SwitchScreen