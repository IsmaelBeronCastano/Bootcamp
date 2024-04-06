import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { MovieDBCastResponse } from "../../../infraestructure/interfaces/full-movie.interface";
import { CastMapper } from "../../../infraestructure/mappers/cast.mapper";
import { Cast } from "../../entities/movie.entity";

export const getMovieCastUseCase = async (fetcher: HttpAdapter, movieId: number): Promise<Cast[]>=>{
    try {
        const {cast} = await fetcher.get<MovieDBCastResponse>(`/3/movie/${movieId}/credits`)

        const actors = cast.map((actor)=> CastMapper.fromMovieDBToEntity(actor))
        return actors

    } catch (error) {
        throw new Error('Can´t get movie cast')
    }
}