import { type RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { type RootstackParams } from '../../routes/StackNavigator'
import { globalStyles } from '../../theme/theme'

export const ProductScreen = () => {

  const {id, name} = useRoute<RouteProp<RootstackParams, 'Product'>>().params //los argumentos estan en .params
  const navigation = useNavigation()

  useEffect(()=>{
    navigation.setOptions({
      title: name
    })
  },[])

  return (
    <View style={globalStyles.container} >
        <Text style={{fontSize: 20, textAlign: 'center', marginTop: 20}}>{id} - {name} </Text>
    </View>
  )
}