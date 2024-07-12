import { API_KEY } from "@env";
import { AxiosAdapter } from "./axios.adapter";

export const fullMovieAdapter = new AxiosAdapter({
    baseURL: "https://api.themoviedb.org/3/movie",
    params: {
        api_key: API_KEY ?? 'no key',
        language: 'es'
    }
})