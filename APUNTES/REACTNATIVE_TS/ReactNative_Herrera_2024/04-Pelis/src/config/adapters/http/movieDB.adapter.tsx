import { API_KEY } from "@env";
import { AxiosAdapter } from "./axios.adapter";

export const MovieDBFetcher = new AxiosAdapter({
    baseURL: "https://api.themoviedb.org",
    params: {
        api_key: API_KEY ?? 'no key',
        language: 'es'
    }
})