import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '../../../config/theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { globalStyles } from '../../../config/theme/theme'

interface Props{
    text: string
    safe?: boolean
    backgroundColor?: string
}

export const SubTitle = ({text, safe= false, backgroundColor= colors.background}: Props) => {

    const {top} = useSafeAreaInsets()
  
    return (
    
      <Text style={{
            ...globalStyles.subTitle,
            marginTop: safe? top: 0,
            marginBottom: 10,
            backgroundColor
      }}>{text}</Text>
    
  )
}