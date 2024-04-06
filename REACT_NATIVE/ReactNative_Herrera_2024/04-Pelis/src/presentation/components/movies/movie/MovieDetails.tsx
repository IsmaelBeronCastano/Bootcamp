import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { Cast, FullMovie } from '../../../../core/entities/movie.entity'
import { Formatter } from '../../../../config/helpers/formatter'
import { CastActors } from '../../actors/CastActors'

interface Props{
    movie: FullMovie
    actors: Cast[]
}

export const MovieDetails= ({movie, actors}: Props) => {
  return (
    <>
    <View style={{marginHorizontal: 20}}>
      <View style={{flexDirection: 'row'}}>
            <Text>{movie.rating}</Text>
            <Text style={{marginLeft: 5}}>
                - {movie.genres.join(', ')}    
             </Text>

      </View>
    </View>

    <Text style={{fontSize: 23, marginTop:10, marginBottom: 5, fontWeight:'bold', marginHorizontal: 10}} >
        Historia
    </Text>
    <Text style={{fontSize: 16, marginBottom: 20, marginHorizontal: 10}}>{movie.description}</Text>

    <Text style={{fontSize: 23, marginTop: 10, fontWeight:'bold', marginHorizontal: 10}} >
        Presupuesto
    </Text>
    <Text style={{fontSize: 16, marginBottom: 35, marginHorizontal: 10}}>{Formatter.currency(movie.budget)}</Text>

    <View>
        <Text style={{fontSize: 23, marginVertical: 10, fontWeight: 'bold', marginHorizontal: 20}} >
           Actores
        </Text>

        <FlatList 
        data={actors}
        keyExtractor={(item)=>item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item})=><CastActors actor={item}  />}
        />

        
    </View>
    </>
  )
}