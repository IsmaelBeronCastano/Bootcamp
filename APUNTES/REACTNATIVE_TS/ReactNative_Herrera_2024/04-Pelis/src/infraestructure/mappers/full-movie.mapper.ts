import { FullMovie } from "../../core/entities/movie.entity"
import { MovieDBMovie } from "../interfaces/full-movie.interface"

export class FullMovieMapper {

    static fromMovieDBToEntity(result: MovieDBMovie): FullMovie{

        return{
        id: result.id,
        title: result.title,
        description: result.overview,
        releaseDate: new Date(result.release_date),
        rating: result.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/w500${result.backdrop_path}`,
        genres: result.genres.map(genre=>genre.name),
        duration: result.runtime,
        budget: result.budget,
        originalTitle: result.original_title,
        productionCompanies: result.production_companies.map(company=>company.name)}

    }

}
    
