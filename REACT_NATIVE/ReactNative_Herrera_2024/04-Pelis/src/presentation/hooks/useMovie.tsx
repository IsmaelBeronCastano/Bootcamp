import React, { useEffect, useState } from 'react'
import * as UseCase from '../../core/use-cases'
import { Cast, FullMovie } from '../../core/entities/movie.entity'
import { MovieDBFetcher } from '../../config/adapters/http/movieDB.adapter'

const useMovie = (movieId: number) => {
  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState<FullMovie>()
  const [cast, setCast] = useState<Cast[]>()

  useEffect(()=>{
    loadMovie()
},[movieId])

  const loadMovie = async()=>{
    setIsLoading(true)

      const fullMoviePromise = UseCase.getMovieUseCase(MovieDBFetcher, movieId)
      const movieCastPromise = UseCase.getMovieCastUseCase(MovieDBFetcher, movieId)

      const [fullMovie, movieCast] = await Promise.all([fullMoviePromise, movieCastPromise])

      setMovie(fullMovie)
      setCast(movieCast)
      setIsLoading(false)

      
    
  }
  
    return {
      isLoading,
      movie,
      cast
    }
}

export default useMovie