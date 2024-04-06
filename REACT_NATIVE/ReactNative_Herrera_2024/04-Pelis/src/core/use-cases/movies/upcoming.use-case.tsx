import { HttpAdapter } from "../../../config/adapters/http/http.adapter"
import { MovieDBResponse} from "../../../infraestructure/interfaces/movieDBResponses"
import { MovieMapper } from "../../../infraestructure/mappers/movie.mapper"
import { Movie } from "../../entities/movie.entity"



export const moviesUpcomingUseCase= async(fetcher: HttpAdapter): Promise<Movie[]>=>{
    try {
        
        const upcomingMovies  = await fetcher.get<MovieDBResponse>('/3/movie/upcoming')

        return upcomingMovies.results.map(MovieMapper.fromMovieDBResultToEntity)      
        
    } catch (error) {
     throw new Error(`fetch error to upcoming movies use case`)   
    }
}