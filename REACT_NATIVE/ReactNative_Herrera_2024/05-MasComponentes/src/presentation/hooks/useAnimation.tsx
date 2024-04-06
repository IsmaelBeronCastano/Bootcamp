import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

export const useAnimation = () => {

    const animatedOpacity = useRef(new Animated.Value(0)).current

    const animatedTop = useRef(new Animated.Value(0)).current
  
    const fadeIn = ({duration= 400, toValue=1, callback= ()=>{}})=>{
    
      Animated.timing(animatedOpacity,{
        toValue,
        duration, 
        useNativeDriver: true 
      }).start(callback)
    }
  
    const fadeOut =({toValue=0, duration=400, callback=()=>{}})=>{
      Animated.timing(animatedOpacity,{
        toValue,
        duration,
        useNativeDriver: true
      }).start(callback)
    }

    const startMovingTopPosition =({initialPosition= 0, toValue=0, duration=700, easing= Easing.linear, callback=()=>{}})=>{
        animatedTop.setValue(initialPosition)
        Animated.timing(animatedTop, {
            toValue,
            duration,
            useNativeDriver: true,
            easing
        }).start(callback)      
    }
    
    return {
        animatedTop,
        animatedOpacity,
        startMovingTopPosition,
        fadeIn,
        fadeOut
    }
    
}