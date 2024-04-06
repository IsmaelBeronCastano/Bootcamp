import { Text, View, TextInput, StyleSheet } from 'react-native'
import React, {useState}  from 'react'


interface Props{
    title: string
    placeholder: string
    onChangeText: (text:string)=> void
}

export default ({title, ...rest}: Props)=> {
    return (
      <View style={styles.wrapper} >
        <Text>{title}</Text>
        <TextInput {...rest} />
      </View>
    )
  
}

const styles = StyleSheet.create({
      wrapper:{
        height: 40,
      }
});