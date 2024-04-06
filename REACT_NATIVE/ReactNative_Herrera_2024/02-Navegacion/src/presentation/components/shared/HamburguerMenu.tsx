import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, Text } from 'react-native'
import IconComponent from './IconComponent'

const HamburguerMenu = () => {
  
    const navigation = useNavigation()

    useEffect(()=>{
      navigation.setOptions({
        headerLeft: ()=>(
         <Pressable onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer)}>
          <IconComponent  name="menu-outline" size={30} color="orange"  />
         </Pressable> 
        )
      })
    }, [])
  
    return (<></>) 
}

export default HamburguerMenu