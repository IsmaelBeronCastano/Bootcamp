import React from 'react'
import { Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { StackActions, useNavigation } from '@react-navigation/native'

export const SettingsScreen = () => {

  const navigator = useNavigation()

  return (
    <View style={globalStyles.container} >
        <Text style={{marginBottom: 10}} >SettingsScreen</Text>

        <PrimaryButton 
        label="Regresar"
        onPress={()=>navigator.goBack()} />
        
        <PrimaryButton 
        label="Home"
        onPress={()=>navigator.dispatch(StackActions.popToTop())} />
    </View>
  )
}