import React from 'react'
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'
import { View, Text, useWindowDimensions } from 'react-native'
import { BottomNavigator } from './BottomNavigator'


const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {

  const dimensions = useWindowDimensions();
  
    return (
    <Drawer.Navigator 
      drawerContent={(props)=> <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: dimensions.width >= 758? 'permanent': 'slide', //siempre se mostrará el menú en horizontal
      drawerActiveBackgroundColor: 'orange',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerItemStyle:{
        borderRadius: 100,
        paddingHorizontal: 20
      }
      }} >
        <Drawer.Screen name="Tabs" component={BottomNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

const CustomDrawerContent = (props: DrawerContentComponentProps)=>{
  
  return(<DrawerContentScrollView>
    <View style={{
      height: 200,
      backgroundColor: '#ded1a9',
      margin: 30,
      borderRadius: 50
    }}><Text style={{color: 'white', fontSize:30, lineHeight: 200, textAlign: 'center'}}>Image</Text>
    </View>

    <DrawerItemList {...props} />
  </DrawerContentScrollView>)
}

export default SideMenuNavigator