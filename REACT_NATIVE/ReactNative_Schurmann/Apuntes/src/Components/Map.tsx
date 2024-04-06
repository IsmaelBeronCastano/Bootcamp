import React from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps'


interface Props{
  onLongPress: (event:LongPressEvent)=> void | undefined
}


export default ({onLongPress}: Props)  => {
  return (
    <MapView style={styles.map} onLongPress={onLongPress} />    
  )
}

const styles = StyleSheet.create({
    map:{
        height: Dimensions.get('window').height - 150,
        width: Dimensions.get('window').width
      },
});

