
import React, { useState } from 'react'
import { Animated, ImageStyle, StyleProp, View } from 'react-native'
import { useAnimation } from '../../hooks/useAnimation'
import { ActivityIndicator } from 'react-native-paper'

interface Props{
    uri: string,
    style?: StyleProp<ImageStyle>
}

export const FadeInImage = ({uri, style}: Props) => {
    const {fadeIn, animatedOpacity}= useAnimation()
    const [isLoading, setIsLoading] = useState(true)
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>

    {isLoading && 
    <ActivityIndicator 
        style={{position: 'absolute'}}
        color= 'blue'
        size={30}
    />}

      <Animated.Image
        source={{uri}}
        onLoadEnd={()=>(
            fadeIn({duration:1000}),
            setIsLoading(false)
        )}
        style={[style, {opacity: animatedOpacity}]}
        
      />
    </View>
  )
}