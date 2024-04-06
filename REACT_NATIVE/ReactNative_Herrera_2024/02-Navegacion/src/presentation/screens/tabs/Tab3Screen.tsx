import React from 'react'
import {Text, View } from 'react-native'
import HamburguerMenu from '../../components/shared/HamburguerMenu'
import Icon from 'react-native-vector-icons/Ionicons'

export const Tab3Screen = () => {
  return (
    <View>
      <HamburguerMenu />
        <Text style={{fontSize:40, textAlign: 'center', marginVertical: 10}}>Tab3Screen</Text>
        <Icon name='rocket' size={30} color="#2d6ab9" style={{textAlign: 'center'}} />
    </View>
  )
}