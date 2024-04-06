import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export const ProfileScreen = () => {

  const {top} = useSafeAreaInsets()
  const navigator = useNavigation()
  
  return (
    <View style={{flex: 1, paddingHorizontal: 20, marginTop: top+10}}>
        <Text style={{textAlign: 'center', fontSize:30, marginBottom: 10}} >Profile</Text>

        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 10}}>
          <PrimaryButton label="Abrir Menú" onPress={()=>navigator.dispatch(DrawerActions.toggleDrawer)}/>
        </View>
    </View>
  )
}