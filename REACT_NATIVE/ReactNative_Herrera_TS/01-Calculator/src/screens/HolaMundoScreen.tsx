import React from 'react'
import { Text, View } from 'react-native'

export const HolaMundoScreen = ({hola="holaMundo"}) => {
  return (
    <View style={{
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize:50,
          textAlign: 'center'
          }}>
          {hola} </Text>
      </View>
  )
}
