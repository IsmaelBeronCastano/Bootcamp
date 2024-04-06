import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import {FAB} from 'react-native-paper'

export const FloatingAB = () => {
  return (
    <FAB 
    style={styles.fab} 
    onPress={()=>console.log("FAB!")}
    icon='add'
    />
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS === 'android'? 15: 0
  }
})