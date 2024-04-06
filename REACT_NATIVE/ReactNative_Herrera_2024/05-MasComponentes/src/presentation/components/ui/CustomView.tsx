import React, { ReactNode } from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { globalStyles } from '../../../config/theme/theme'

interface Props{
    style?: StyleProp<ViewStyle>
    children?: ReactNode 
    margin?: boolean
}


export const CustomView = ({margin = false, style, children}: Props) => {
  return (
    <View style={[
      margin ? globalStyles.mainContainer: null, 
      style]} >
      {children}
    </View>
  )
}