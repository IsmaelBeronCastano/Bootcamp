# REACT NATIVE - App Películas parte 1

- Vamos a hacer el esqueleto y la estructura necesaria para la aplicación
- Lo haremos bajo principios de arquitectura DDD y patrones (haremos uso del patrón repositorio)
- Veremos las diferencias entre config, core, infraestructure y presentation y cómo se integran
- Nos vamos a centrar en traer la info de movieDB
- La app debe ser lo suficiente flexible para tolerar cambios
----

## Configuración de pantallas y directorios

- Creo en src
    - config
        - adapters (dónde guardaré los archivos de patrón adaptador)
        - helpers
    - core (casos de uso)
    - presentation
        - hooks
        - components
        - navigation
        - screens
            - details (detalles de peliculas)
            - home
    - infraestructure (es nuestro middleman)

- Creo los componentes HomeScreen y Detailsscreen
- Muevo App dentro de src
----

## Navegación entre pantallas

- Hago las instalaciones necesarias para integrar la navegación en la aplicación

> npm i @react-navigation/native
> npm i react-native-screens react-native-safe-area-context

- Para la navegación Stack

> npm i @react-navigation/stack
> npm i react-native-gesture-handler @react-native-masked-view/masked-view

- Puedo configurar mi NavigationContainer
- Hay que colocar este import en el top del archivo principal

~~~js
import 'react-native-gesture-handler'
import React from 'react';
import {Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';

export const App=(): React.JSX.Element=>{

  return(

   <NavigationContainer>
      <Text>Hello World</Text>
   </NavigationContainer>
          
   )
}
~~~

- Uso el ejemplo de la documentación para crear el Stack Navigator
- Tipo el Navigator con RootstackParams
- Empleo screenOptions para ocultar los headers 

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/Homescreen';
import { Detailsscreen } from '../screens/details/DetailsScreen';

const Stack = createStackNavigator();

export const Navigation =()=>{
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={Detailsscreen} />
    </Stack.Navigator>
  );
}
~~~

- Coloco Navigation dentro de App
-------

## Obtener Peliculas - TheMovieDB

- Creo una cuenta en theMovieDB.org
- En Editar Perfil / API / le doy cick al enlace para generar la llave
- La guardo (y el token también) en .env
- Creo .env.template para guardar las variables vacias que digan que es lo que necesito configurar
- Añado .env a .gitignore
- Creo el README

~~~md
# README

1. Clonar el proyecto
2. Instalar dependencias `npm install`
3. Clonar el archivo .env.template a .env y configurar las variables de entorno
4. Ejecutar el proyecto con `npm run start`
~~~

- Voy a la documentación de MovieDB
- En Authentication tengo el token de autenticación (no es el mismo que obtuve con la llave). Lo copio en .env
- Puedo seleccionar Node como lenguaje
- Para buscar un endpoint en especifico puedo ir al buscador JUMP TO y , en este caso, escribo **now playing**
- Donde me da el ejemplo de código puedo elegir que quiero usar, si fetch, axios. Selecciono Axios
- Este es el ejemplo

~~~js
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJh....'
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
~~~

- Implementaremos Axios con el patrón adaptador
- Por ahora solo necesito el endpoint que es `https://api.themoviedb.org/3/movie/now_playing`
- Debo mandar mi API_KEY como params en POSTMAN o similares bajo el nombre de api_key
- En THUNDERCLIENT es en Query
- Puedo añadirle language es para que aparezca en español
----

## Patrón Adaptador

- En adapters creo en la carpeta http/http.adapter.tsx
- Porqué lo hago con una clase abstracta?
  - Porque yo no quiero crear instancias de esta clase
  - Lo que aqui defina no va estar implementado
  - Voy a definir las reglas de los métodos y propiedades que deben de tener las clases que extiendan de mi adaptador
  - Options lo hago opcional. Puedo usar Record para decirle que el tipo de dato será de tipo string y el valor al que apunta unknown
  - Si quisiera hacer algo muy genérico usaria tipo any
  - Resuelve en una promesa de tipo genérico

~~~js
export abstract class HttpAdapter{

    abstract get<T>(url: string, options?: Record<string, unknown>) : Promise<T> 
}
~~~

- Instalo axios
- Creo en http/axios.adapter.tsx
- Implemento el método get, uso async await y un trycatch
- Extraigo la data del fetch de axios
- Tipo la respuesta de axios con el mismo genérico que el método
- Retorno la data

~~~js
import { HttpAdapter } from "./http.adapter";
import axios, { AxiosInstance } from 'axios'

interface Options{
    baseURL: string,
    params: Record<string,string>
}

export class AxiosAdapter implements HttpAdapter{

    private axiosInstance : AxiosInstance;

    constructor(options: Options){
        this.axiosInstance = axios.create({
            baseURL: options.baseURL,
            params: options.params
        })
    }


    async get<T>(url: string, options?: Record<string, unknown>) : Promise<T>{

        try {
            const {data} = await this.axiosInstance.get<T>(url,options)
            
            return data
        
        } catch (error) {
            throw new Error(`Error fetching get: ${url}` )
        }
    }
}
~~~
-----

## Casos de uso - Now Playing

- En /core/use-cases/movies/now-playing.use-case.tsx
- Now playing debe traer las peliculas usando el adaptador de axios
- Se busca que los casos de uso sean agnósticos (que no necesiten paquetes de terceros para funcionar)
- Le paso de parámetro *fetcher* que serña del tipo HttpAdapater (el mismo que mi adaptador de axios)
- Podría pasar el url como parámetro para hacerlo más genérico, pero yo se que en este caso de uso siempre voy a llamar al mismo endpoint
- Como la cabecera de la url la voy a configurar en el adaptador, añado solo la parte de la url de '/now_playing'
- Hay que tipar la respuesta, por lo que hago un llamado al endpoint desde THUNDERCLIENT y uso paste JSON as code
- La pego en infraestructure/interfaces/movieDBResponses.tsx
- Cambio algunos nombres y en lugar de usar guiones bajos uso camelCase

~~~js
export interface NowPlayingResponse {
    dates:         Dates;
    page:          number;
    results:       Result[];
    totalPages:   number;
    totalResults: number;
}

export interface Dates {
    maximum: string;
    minimum: string;
}

export interface Result { //Esto sería Movie
    adult:             boolean;
    backdrop_path:     string;
    genre_ids:         number[];
    id:                number;
    original_language: string;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    release_date:      string;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

/*
export enum OriginalLanguage {
    En = "en",
    Es = "es",
}
*/
~~~

- Lo que va a regresar el fetcher va a ser de tipo NowPlayingResponse
- Para tipar la respuesta de la promisa bien podría usar la interfaz de Movie, pero podría ser que la DB cambiara en un futuro, y eso podría darme un dolor de cabeza
- En lugar de usar una interfaz proveniente de la db, creo /core/entities/movie.entity.tsx
- Usualmente la entity es una clase, pero también puedo trabajar con una interfaz y luego transformarla en una clase

~~~js
export interface Movie{
    id: number
    title: string
    description: string
    releaseDate: Date
    rating: number
    poster: string
    backdrop: string
}
~~~

- Entonces, voy a usar mi propio modelo. En la respuesta los nombres vienen diferente, por ejemplo *poster_path* en lugar de poster
- Voy a tener que transformar la data de la respuesta para que concuerde con mi entity, ya que la respuesta de la DB no es exactamente igual
- Todo esto lo hago porque si el día de mañana la interfaz que extraje de la DB cambia, mi aplicación crashearía

~~~js
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { NowPlayingResponse } from "../../../infraestructure/interfaces/movieDBResponses";
import { Movie } from "../../entities/movie.entity";


export const moviesNowPlayingUseCase = async(fetcher: HttpAdapter): Promise<Movie[]>=>{
    try {
        const nowPlaying = await fetcher.get<NowPlayingResponse>('/now_playing')

        console.log({nowPlaying})

        return []//Aquí voy a tener que transformar la data para adaptarlo a como lo he tipado yo en mi entidad
                 //y no con los nombres y el conjunto de propiedades que viene desde la DB
        
    } catch (error) {
        throw new Error (`Error fetching movies - Now Playing`)
    }
}
~~~
-------

## Custom Hook useMovies

- Creo en src/presentation/hooks/useMovies.tsx
- Llamo al caso de uso en un useEffect
- Antes creo un index.ts en use-cases y lo exporto todo

~~~js
export * from './movies/now-playing.use-case'
~~~

- Puedo hacer el import com UseCases para disponer de los distintos casos de uso que vaya creando con la notación de punto
- La función me pide el fetcher de tipo HttpAdapter.
- Creo un nuevo adaptador llamado MovieDBAdapter con un ainstancia de mi adaptador Axios, le paso lo que necesita
  - En baseURL le paso la url hasta now_playing (sin incluir este ni el slash que le precede)
  - En params le paso la api_key y el language

~~~js
import { AxiosAdapter } from "./axios.adapter";

export const MovieDBFetcher = new AxiosAdapter({
    baseURL: "https://api.themoviedb.org/3/movie",
    params: {
        api_key: "mi_api_key", //será una variable de entorno
        language: 'es'
    }
})
~~~

- Le paso el fetcher (MovieDBFetcher) al caso de uso
- Llamo la función dentro del useEffect

~~~js
import React, { useEffect, useState } from 'react'
import { Movie } from '../../core/entities/movie.entity'
import * as UseCases from '../../core/use-cases'
import { MovieDBFetcher } from '../../config/adapters/http/movieDB.adapter'

const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([])

    useEffect(()=>{
        initLoad()
    },[])

    const initLoad= async()=>{
        const nowPlayingMovies = await UseCases.moviesNowPlayingUseCase(MovieDBFetcher)
    }
    
    return {
        

    }
}

export default useMovies
~~~

- En HomeScreen llamo al hook, no desestructuro nada porque todavñia no regresa nada

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import useMovies from '../../hooks/useMovies'

export const HomeScreen  = () => {

  const {} = useMovies()
  
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}
~~~

- Ahora en consola (por el console.log de nowPlaying en el caso de uso) deberían aparecer los resultados pero con Object Object
- Falta transformar la data resultante en algo que luzca como mi interfaz de Movie, para usar mi propia implementación
-------

## Patrón Mapper - MovieMapper

- Creo en src/infraestructure/mappers/movie.mapper.ts
- Puedo hacer el mapper con una función pero lo haré con una clase
- Creo un método estático. Al ser estático no necesito instanciar la clase
- El método recibe result de tipo Result (mirar la interfaz de MovieDB) y regresará una Movie. 
- Si Movie fuera una clase tendría que instanciarla pero hasta ahora la hemos manejado con una interfaz
- releaseDate me regresa un dato de tipo string, por lo que creo la fecha con new Date
- Para ver la imagen de la propiedad poster, esta solo devuelve un string que no me sirve, para visualizarla necesito añadir https://image.tmdb.org/t/p/w500/url_de_posterPath
- Uso un template string, quito el slash final porque el string vendrá con el slash inicial

~~~js
import { Movie } from "../../core/entities/movie.entity";
import { Result } from "../interfaces/movieDBResponses";

export class MovieMapper{

    static fromMovieDBResultToEntity(result: Result): Movie{
        return {
            id: result.id,
            title: result.title,
            description: result.overview,
            releaseDate: new Date(result.release_date),
            rating: result.vote_average,
            poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w500${result.backdrop_path}`
        }
    }
}
~~~

- Si la url de poster no viniera, puedo manejar la excepción en el mapper
- Voy al caso de uso.
- Se recomienda que los casos de uso sean funciones puras que resuelvan con los argumentos dados
  - Pero en este caso quiero transformar la data por lo que usaré el mapper
  - En .results tengo la data, hago un map y la paso por el mapper
  - En JS cuando tengo el mismo argumento pasado como parámetro para una función puedo obviar ambos

~~~js
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { NowPlayingResponse } from "../../../infraestructure/interfaces/movieDBResponses";
import { MovieMapper } from "../../../infraestructure/mappers/movie.mapper";
import { Movie } from "../../entities/movie.entity";


export const moviesNowPlayingUseCase = async(fetcher: HttpAdapter): Promise<Movie[]>=>{
    try {
        const nowPlaying = await fetcher.get<NowPlayingResponse>('/now_playing')

       

     //return nowPlaying.results.map(result=>MovieMapper.fromMovieDBResultToEntity(result))
       
       return nowPlaying.results.map(MovieMapper.fromMovieDBResultToEntity)
        
    } catch (error) {
        throw new Error (`Error fetching movies - Now Playing`)
    }
}
~~~

- Hago un console.log en la función initLoad del hook useMovies para visualizar el resultado en consola
- Retorno el state de isLoading y nowPlaying que es donde estan mis películas

~~~js
import React, { useEffect, useState } from 'react'
import { Movie } from '../../core/entities/movie.entity'
import * as UseCases from '../../core/use-cases'
import { MovieDBFetcher } from '../../config/adapters/http/movieDB.adapter'

const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([])

    useEffect(()=>{
        initLoad()
    },[])

    const initLoad= async()=>{
        const nowPlayingMovies = await UseCases.moviesNowPlayingUseCase(MovieDBFetcher)
        setNowPlaying(nowPlayingMovies)
        //console.log({nowPlayingMovies})
    }
    
    return {
        isLoading,
        nowPlaying
    }
}

export default useMovies
~~~
----

## Casos de uso restantes

- Quiero implementar tres nuevos casos de uso
  - /upcoming
  - /top_rated
  - /popular  moviesPopularUseCase

- Creo el caso de uso y le paso el fetcher, devuelvo una promesa del tipo entity que yo me cree basándome en la interfaz que extraigo con paste JSON as code
- Hago un llamado al endpoint, copio el resultado y uso pasteJSON as code para obtener las interfaces
- Creo mi entity para luego crear el mapper y obtener la data como yo quiero sin depender de terceros
- Expongo el caso de uso Upcoming
- upcoming.inteface.ts

~~~js
// Generated by https://quicktype.io

export interface UpcomingResults {
    dates:         Dates;
    page:          number;
    results:       Result[];
    total_pages:   number;
    total_results: number;
}

export interface Dates {
    maximum: string;
    minimum: string;
}

export interface Result {
    adult:             boolean;
    backdrop_path:     string;
    genre_ids:         number[];
    id:                number;
    original_language: string;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    release_date:      string;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}
~~~

- Creo mi entity

~~~js
export interface UpcomingMovie{
    genreIds: number[]
    id: number
    originalLanguage: string
    originalTitle: string
    posterPath: string,
    backdropPath: string
    releaseDate: Date
    rate: number
}
~~~

- Creo el Mapper

~~~js
import { UpcomingMovie } from "../../core/entities/upcoming.entity";
import { Result } from "../interfaces/upcomingMovies.interface";

export class UpcomingMovieMapper{

    static getUpcomingResultToEntity (result: Result ) : UpcomingMovie{
        return {
            genreIds: result.genre_ids,
            id: result.id,
            originalLanguage: result.original_language,
            originalTitle: result.original_title,
            posterPath: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
            backdropPath: `https://image.tmdb.org/t/p/w500${result.backdrop_path}`,
            releaseDate: new Date(result.release_date),
            rate: result.vote_average
        }
    }
}
~~~

- Voy al caso de uso y utilizo .map
- Lo exporto en el archivo de barril

~~~js
import { HttpAdapter } from "../../../config/adapters/http/http.adapter"
import { UpcomingResults } from "../../../infraestructure/interfaces/upcomingMovies.interface"
import { UpcomingMovieMapper } from "../../../infraestructure/mappers/upcoming.mapper"
import { UpcomingMovie } from "../../entities/upcoming.entity"


export const moviesUpcomingUseCase= async(fetcher: HttpAdapter): Promise<UpcomingMovie[] | undefined>=>{
    try {
        
        const upcomingMovies  = await fetcher.get<UpcomingResults>('/upcoming')

        return upcomingMovies.results.map(UpcomingMovieMapper.getUpcomingResultToEntity)

    } catch (error) {
     throw new Error(`fetch error to upcoming movies use case`)   
    }
}
~~~

- index.ts

~~~js
export * from './movies/now-playing.use-case'
export * from './movies/upcoming.use-case'
~~~

- Creo el adaptador

~~~js
import { AxiosAdapter } from "./axios.adapter";

export const UpcomingAdapter = new AxiosAdapter({
    baseURL: 'https://api.themoviedb.org/3/movie',
    params:{
        api_key: "fe1099f21bfaef01ab67feb300828d6d",
        language: 'es'
    }
})
~~~

- Creo el hook

~~~js
import React, { useEffect, useState } from 'react'
import { UpcomingMovie } from '../../core/entities/upcoming.entity'
import * as UseCases from '../../core/use-cases'
import { UpcomingAdapter } from '../../config/adapters/http/upcoming.adapter'

const useUpcoming = () => {
  
    const [isLoading, setIsLoading] = useState(true)
    const [upcomingMovies, setUpcomingMovies] = useState<UpcomingMovie[] | undefined>([])

    useEffect(()=>{
        initLoadUpcoming()
    }, [])


    const initLoadUpcoming = async ()=>{

        const upcomingMoviesResult = await UseCases.moviesUpcomingUseCase(UpcomingAdapter)

        console.log({upcomingMoviesResult})

        setUpcomingMovies(upcomingMoviesResult)
    }
    
  
    return {
        isLoading,
        upcomingMovies
  }
}

export default useUpcoming
~~~

- Lo llamo en HomeScreen para ver si funciona 
- Por algún motivo no muestra el array de genreIds, solo muestra Array
- Hago el resto de casos de uso
- Para subirlo a git **he quitado la API_KEY hasta que no configure las variables de entorno**
-----

## REFACTORING

- En lugar de usar un hook para cada caso de uso, usaremos el mimso useMovies y el Promise.all
- Usaremos la misma entidad Movie para todos. 
- Le pongo un nombre genérico a la interfaz para usarla en todos los casos de uso
- Uso la misma entity en todos los casos y states
- En useMovie hago carpintería 

~~~js
import React, { useEffect, useState } from 'react'
import { Movie } from '../../core/entities/movie.entity'
import * as UseCases from '../../core/use-cases'
import { MovieDBFetcher } from '../../config/adapters/http/movieDB.adapter'

const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([])
    const [popularMovie, setpopularMovie] = useState<Movie[]>([])
    const [topRatedMovie, setTopRatedMovie] = useState<Movie[]>([])
    const [upcomingMovie, setupcomimgMovie] = useState<Movie[]>([])

    useEffect(()=>{
        initLoad()
    },[])

    const initLoad= async()=>{
        const nowPlayingPromise = UseCases.moviesNowPlayingUseCase(MovieDBFetcher)
        const popularPromise = UseCases.PopularUseCase(MovieDBFetcher)
        const topRatedPromise = UseCases.TopRatedUseCase(MovieDBFetcher)
        const upcomingPromise = UseCases.moviesUpcomingUseCase(MovieDBFetcher)

        const[
            nowPlayingMovies,
            popularMovies,
            topRatedMovies,
            upcomingMovies
        ] = await Promise.all([nowPlayingPromise, popularPromise, topRatedPromise, upcomingPromise])
        

        setNowPlaying(nowPlayingMovies)
        setpopularMovie(popularMovies)
        setTopRatedMovie(topRatedMovies)
        setupcomimgMovie(upcomingMovies)
    }
    
    return {
        isLoading,
        nowPlaying
    }
}

export default useMovies
~~~

- **NOTA:** esta es una aproximación al DDD, faltarían los data sources y el repositorio que interactuaría con los casos de uso.
    - Los casos de uso no serían una función sino una clase o un Factory Function, y no le pasariamos el fetcher si no que le inyectaríamos el repositorio para poder consumir la info
   

