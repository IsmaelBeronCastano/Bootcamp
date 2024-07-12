import React from 'react'
import { Image, Text, View } from 'react-native'
import { Cast } from '../../../core/entities/movie.entity'

interface Props{
    actor: Cast
}

export const CastActors = ({actor}: Props) => {
  return (
    <View style={styles.container} >
      <Image source={{uri: actor.avatar}} style={{width:100, height: 100, borderRadius: 10}} />

      <View style={styles.actorInfo}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}} >
            {actor.name}
        </Text>
        <Text style={{fontSize: 12, opacity: 0.7}} >
            {actor.character}
        </Text>

      </View>
    </View>
  )
}



import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container:{
    marginRight:10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    width: 100
  },
  actorInfo:{
    marginLeft: 10,
    marginTop: 4
  }
})