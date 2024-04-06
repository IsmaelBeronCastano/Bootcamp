import { FlatList, Text, View } from 'react-native'
import React  from 'react'
import { Puntos } from '../../App'

interface Props{
  puntos: Puntos[]
}

export default ({puntos}: Props)=> {
    return (
      <FlatList
      data={puntos.map((x:Puntos)=> x.nombre)}
      renderItem={({item})=> <Text>{item}</Text>}
      keyExtractor={(item: any)=> item}
      />
    )
  
}