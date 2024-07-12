import React from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { globalStyles } from '../../theme/theme'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { type RootstackParams } from '../../routes/StackNavigator'

const products=[
  {id:1, name: "Spaceship"},
  {id:2, name: "Car"},
  {id:3, name: "Plane"},
  {id:4, name: "MotorCycle"},
  {id:5, name: "Bike"},
]

export const ProductsScreen = () => {

  const navigation = useNavigation<NavigationProp<RootstackParams>>()

  return (
    <View style={globalStyles.container}>
      <Text style={{textAlign: 'center', fontSize: 30, marginBottom: 10}}>Productos</Text>
        <FlatList  
        data={products}
        renderItem={({item})=>(
        <PrimaryButton
          label={item.name}
          onPress={()=>{navigation.navigate("Product", {id: item.id, name: item.name}) } } />)} 
        />

        <Text style={{marginBottom: 10, fontSize:30, textAlign: 'center'}}>Ajustes</Text>
        <PrimaryButton label={"Ajustes"} onPress={()=>navigation.navigate("Settings")} />
    </View>
  )
}