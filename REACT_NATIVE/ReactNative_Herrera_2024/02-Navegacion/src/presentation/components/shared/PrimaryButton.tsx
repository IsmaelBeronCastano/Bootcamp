import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'

interface Props{
    onPress: ()=> void
    label: string
}

export const PrimaryButton  = ({label, onPress}: Props) => {



  return (
    <Pressable 
    onPress={onPress}
    style={globalStyles.primaryButton} >
        <Text style={globalStyles.buttonText}>{label}</Text>
    </Pressable>
  )
}