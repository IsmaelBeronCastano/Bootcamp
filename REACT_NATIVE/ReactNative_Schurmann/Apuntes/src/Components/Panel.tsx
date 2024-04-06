import { Button, GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import React  from 'react'

interface Props{
  onPressLeft:  ((event: GestureResponderEvent) => void) | undefined
  onPressRight:  ((event: GestureResponderEvent) => void) | undefined
  textLeft: string
  textRight: string
}

export default ({onPressLeft, onPressRight, textLeft, textRight}: Props)=> {
    return (
      <View style={styles.panel}>
        <Button title={textLeft} onPress={onPressLeft} />
        <Button title={textRight} onPress={onPressRight} />
      </View>
    )
  
}

const styles = StyleSheet.create({
      panel:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
      }
});