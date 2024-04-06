import React, { useState } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { PrimaryButton } from '../../components/shared'
import {Button} from 'react-native-paper'
import { GlobalStyles } from '../theme/globalStyles'
import { FloatingAB } from '../../components/shared/FloatingAB'
import Icon from 'react-native-vector-icons/Ionicons'

export const CounterScreen = () => {

  const [counter, setCounter] = useState(10)


  const increment = ()=> {
    setCounter(counter +1)
  }

  const decrement = ()=> {
    setCounter(counter -1)
  }

  return (
    <View style={GlobalStyles.centerContainer}>
        <Text style={GlobalStyles.title}>Counter: {counter}</Text>
        <Icon name="accessibility-outline" size={35} />
      <PrimaryButton label="increment" onPress={increment} onLongPress={()=>setCounter(0)} />
      <Button onPress={decrement} mode='contained'>Decrementar</Button>
      <FloatingAB />
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize: 45,
    color:'black',
    fontWeight: '300'
  }
})







