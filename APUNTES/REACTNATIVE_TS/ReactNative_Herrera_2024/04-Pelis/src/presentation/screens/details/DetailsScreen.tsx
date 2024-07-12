import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Text, ScrollView } from 'react-native'
import { RootStackParams } from '../../navigation/Navigation'
import useMovie from '../../hooks/useMovie'
import { MovieHeader } from '../../components/movies/movie/MovieHeader'
import { MovieDetails } from '../../components/movies/movie/MovieDetails'


interface Props extends StackScreenProps<RootStackParams, 'Details'>{}

export const Detailsscreen  = ({route}:Props) => {

  const {movieId} = route.params

  const{isLoading, movie, cast} = useMovie(movieId)


  if(isLoading) {
    return <Text>Loading</Text>
  }
  return (
    <ScrollView>
      <MovieHeader title={movie!.title} originalTitle={movie!.title} poster={movie!.poster} />
      <MovieDetails movie={movie!} actors={cast!} />
    </ScrollView>
  )
}