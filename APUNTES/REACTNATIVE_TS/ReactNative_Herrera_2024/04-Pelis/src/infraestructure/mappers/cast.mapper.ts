import { Cast } from "../../core/entities/movie.entity";
import { MovieDBCast} from "../interfaces/full-movie.interface";

export class CastMapper {
    public static fromMovieDBToEntity(result: MovieDBCast): Cast{
        
            return{
                id: result.id,
                name: result.name,
                character: result.character ?? 'No character',
                avatar: result.profile_path 
                ? `https://image.tmdb.org/t/p/w500${result.profile_path}`
                : 'https://i.stack.imgur.com/l60Hf.png'
            }
        
    }
}