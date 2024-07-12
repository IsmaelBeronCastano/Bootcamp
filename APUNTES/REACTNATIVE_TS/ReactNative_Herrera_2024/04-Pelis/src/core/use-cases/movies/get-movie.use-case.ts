import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { MovieDBMovie } from "../../../infraestructure/interfaces/full-movie.interface";
import { FullMovieMapper } from "../../../infraestructure/mappers/full-movie.mapper";
import { FullMovie } from "../../entities/movie.entity";

export const getMovieUseCase = async (fetcher: HttpAdapter, movieId: number): Promise<FullMovie>=>{

    try { 
        const getFullMovie = await fetcher.get<MovieDBMovie>(`/3/movie/${movieId}`)

        const fullMovie = FullMovieMapper.fromMovieDBToEntity(getFullMovie)
        
        return fullMovie
    
    } catch (error) {
        console.log(error)
        throw new Error("Can't get full movie")
    }


}