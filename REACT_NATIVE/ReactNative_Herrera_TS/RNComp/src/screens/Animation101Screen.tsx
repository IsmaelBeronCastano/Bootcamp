import React, { useRef } from 'react'
import { StyleSheet, View, Animated, Button, Easing } from 'react-native'
import useAnimation from '../hooks/useAnimation'
import HeaderTitle from '../components/HeaderTitle'

const Animation101Screen = () => {

 const {fadeIn, fadeOut, startMovingPosition, opacity, position}= useAnimation()

  return (
   <View style={styles.container} >
    <HeaderTitle title="Animation101" />
    <Animated.View style={{...styles.purpleBox, 
      opacity: opacity, 
      marginBottom: 20,
      transform: [
        {
          translateY: position
        }
      ]}}   />
    <Button 
      title="FadeIn"
      onPress={ ()=>{
        fadeIn(), startMovingPosition() }}
    ></Button>
    <Button 
      title="FadeOut"
      onPress={ fadeOut}
    ></Button>
   </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animation101Screen