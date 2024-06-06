import 'react-native-gesture-handler'
import React  from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { Text } from 'react-native'
import { Navigator } from './src/navigator/Navigator'

export default function App (){
    return (
      <NavigationContainer>
      <Navigator />
      </NavigationContainer>
    )
  
}