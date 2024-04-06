import React from 'react'
import { StyleSheet, View } from 'react-native'
import DraggableView from '../components/DraggableView';
import HeaderTitle from '../components/HeaderTitle';

const Animation102Screen = () => {
  return (
   <View style={{flex:1}} >
    <HeaderTitle title="Animación102" />
    <DraggableView  />
   </View>
  )
}

const styles = StyleSheet.create({
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animation102Screen