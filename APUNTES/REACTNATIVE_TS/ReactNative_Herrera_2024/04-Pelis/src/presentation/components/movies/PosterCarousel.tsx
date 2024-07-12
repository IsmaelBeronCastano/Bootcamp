import React from 'react'
import { Text, View } from 'react-native'
import { Movie } from '../../../core/entities/movie.entity'
import { ScrollView } from 'react-native-gesture-handler'
import Poster from './Poster'

interface Props{
    movies: Movie[]
    height?: number
}

const PosterCarousel = ({movies, height= 440}: Props) => {

  return (
    <View style={{height}} >
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator ={false}
        >
            {movies.map(movie=> <Poster key={movie.id} movie={movie}  />)}
        </ScrollView>
    </View>
  )
}

export default PosterCarousel