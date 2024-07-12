import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { MovieDBResponse} from "../../../infraestructure/interfaces/movieDBResponses";
import { MovieMapper } from "../../../infraestructure/mappers/movie.mapper";
import { Movie } from "../../entities/movie.entity";

interface Options{
    page?: number
    limit?: number
}


export const PopularUseCase = async (fetcher: HttpAdapter, options?: Options): Promise<Movie[]>=>{

    try {
        
        const popularMoviesResult = await fetcher.get<MovieDBResponse>('/3/movie/popular', {
                params:{
                    page: options?.page ?? 1
                }
            })
    
        return   popularMoviesResult.results.map(MovieMapper.fromMovieDBResultToEntity)
        
    } catch (error) {
            throw new Error ('Cant get popular movies')     
    }   
    
}