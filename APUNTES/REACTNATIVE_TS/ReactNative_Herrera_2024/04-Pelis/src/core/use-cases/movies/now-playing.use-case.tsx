import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { MovieDBResponse} from "../../../infraestructure/interfaces/movieDBResponses";
import { MovieMapper } from "../../../infraestructure/mappers/movie.mapper";
import { Movie } from "../../entities/movie.entity";


export const moviesNowPlayingUseCase = async(fetcher: HttpAdapter): Promise<Movie[]>=>{
    try {
        const nowPlaying = await fetcher.get<MovieDBResponse>('/3/movie/now_playing')

        return nowPlaying.results.map(MovieMapper.fromMovieDBResultToEntity)
        
    } catch (error) {
        throw new Error (`Error fetching movies - Now Playing`)
    }
}



