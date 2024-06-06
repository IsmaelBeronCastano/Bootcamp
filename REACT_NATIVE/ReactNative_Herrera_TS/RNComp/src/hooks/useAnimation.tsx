import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

const useAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current
    const position = useRef(new Animated.Value(-100)).current
  
    const fadeIn = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
    }
  

  
    const fadeOut = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
    }
  
    const startMovingPosition =(initPosition: number= -100, duration: number=600 )=>{
        position.setValue(initPosition)

        Animated.timing(
            position,
            {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
              easing: Easing.bounce
            }
          ).start()
        }
    
  
    return {
        opacity,
        position,
        fadeIn,
        fadeOut,
        startMovingPosition
        
    }
}

export default useAnimation