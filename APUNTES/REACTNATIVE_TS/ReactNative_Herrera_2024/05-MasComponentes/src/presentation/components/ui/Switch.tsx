import React from 'react'
import { Switch } from 'react-native-gesture-handler'
import { Platform, Text, View } from 'react-native'

interface Props{
    isOn: boolean
    text?: string
    onChange: (value: boolean) => void
}


export const CustomSwitch = ({isOn, text, onChange}: Props) => {
  return (
    <View style={styles.switchRow}>
        {
            text && <Text style={{color: colors.text}}>{text}</Text>
        }
      
        <Switch
            thumbColor={Platform.OS === 'android'? colors.primary: ""}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={isOn}
            />
    </View>
  )
}


import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'

const styles = StyleSheet.create({
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    }
})