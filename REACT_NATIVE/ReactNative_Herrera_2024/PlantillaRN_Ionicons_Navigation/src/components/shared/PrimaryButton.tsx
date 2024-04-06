import React from 'react'
import { GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

interface Props{
  label: string
  onPress: (event: GestureResponderEvent)=> void
  onLongPress?: (event: GestureResponderEvent)=> void
}

export const PrimaryButton = ({label, onPress, onLongPress}: Props) => {
  return (
    <View>
        <Pressable style={({pressed})=>[
          styles.button,
          pressed && styles.buttonPressed
        ]} onPress={onPress} onLongPress={onLongPress} >
          <Text style={styles.buttonText} >{label}</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  button:{
    backgroundColor: 'purple',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonText:{
    fontSize: 25,
    color: 'white'
  },
  buttonPressed:{
    backgroundColor: Platform.OS === 'android' ?'rgb(126, 0, 78)': 'white'
  }

})