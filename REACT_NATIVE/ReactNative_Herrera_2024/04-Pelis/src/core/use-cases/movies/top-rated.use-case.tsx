import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { MovieDBResponse} from "../../../infraestructure/interfaces/movieDBResponses";
import { MovieMapper } from "../../../infraestructure/mappers/movie.mapper";
import { Movie } from "../../entities/movie.entity";


export const TopRatedUseCase = async (fetcher: HttpAdapter) : Promise<Movie[]>=>{

    try {
        const topRatedMovies = await fetcher.get<MovieDBResponse>('/3/movie/top_rated')

        return topRatedMovies.results.map(MovieMapper.fromMovieDBResultToEntity)    
    
    } catch (error) {
        throw new Error ("Can't get top rated movies")    
    }

    
}