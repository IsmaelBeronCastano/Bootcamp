# 03 TYPESCRIPT HERRERA

## Genéricos

- En lugar de usar any uso un genérico para obtener la autoayuda y las alertas de typescript
- 
~~~ts
//En las funciones de flecha el genérico se define antes del paréntesis después del igual
//En este caso devuelve el genérico también

export const genericFunctionArrow=<T>(argument : T): T=>{
    console.log(argument)
}

//declarando con function los genericos se declaran así ( en este caso devuelve un genérico también )

export function printObject2<T>(argument:T): T{
    console.log(argument)
}

genericFunctionArrow<number>((123.322233).toFixed(2)); //123,32
~~~
-----

## Ejemplo de función genérica en acción

~~~ts
export interface Hero{
    name: string;
    realName: string
}

export interface Villain {
    name: string;
    dangerLevel: number
}

//creo un personaje que puede ser Heroe y Villano
const deadpool = {
    name: "Deadpool",
    realname: "Mr.White",
    dangerLevel: 42
}

//como devuelve un genérico del mismo tipo, al poner . despues del paréntesis me sale la autoayuda de Hero
genericFunctionArrow<Hero>(deadpool).realName; //"Mr.White"     dangerLevel no está disponible al ser de tipo Hero
~~~
-----

## Agrupar imports

- Puedo meter todas las interfaces en /interfaces/index.ts para luego poder importarlas todas en la misma importación de "./interfaces"

- interfaces/index.ts
~~~ts
export {Hero} from './Hero'
export {Villain} from './Villain'
~~~
-----

## Ejemplo aplicado de genéricos

- Usaré la API POKEMON
- Instalo axios

> npm i axios
 
~~~ts
import axios from 'axios'

//async transforma mi función para que retorne una promesa
export const getPokemon = async (pokemonId: number) =>{

    const resp = await axios.get(`https:pokeapi.co/api/v2/pokemon/${pokemonId}`)
    console.log(resp)
    return 1 ;
}


getPokemon(4)
    .then( resp => console.log(resp)
    .catch(error => console.log(error))    //atrapo el error con el catch
    .finally(()=> console.log("Fin de getPokemon"))  // finally no recibe ningún argumento
~~~
-----

## Mapear respuesta http

~~~ts
import axios from 'axios'

                                                     //Especifico que la promesa resuelve en un número   
export const getPokemon = async (pokemonId: number): Promise<number> =>{

    const resp = await axios.get(`https:pokeapi.co/api/v2/pokemon/${pokemonId}`)
    console.log(resp.data) // en data tengo toda la info de pokemon
    return 1
     }
~~~

- Pero lo que yo quiero no es devolver un número si no devolver un objeto de tipo Pokemon
- Para ello creo la interfaz Pokemon

~~~ts
export interface Pokemon{
    name: string;
    picture: string
}
~~~

- Puedo especificarle que lo que luce en la respuesta va aser de tipo Pokemon

~~~ts
export const getPokemon = async (pokemonId: number): Promise<Pokemon> =>{

    const resp = await axios.get<Pokemon>(`https:pokeapi.co/api/v2/pokemon/${pokemonId}`)
    console.log(resp.data.name) // ahora tengo name y picture, pero en el .picture no tengo nada (undefined)
                                //la interfaz sirve para decir como luce un objeto pero no necesariamente va a tener esas propiedades
                                //el name funciona porque ya viene en la respuesta
    return resp.data
     
}
~~~
- Para mapear con una interfaz voy a la API y busco un resultado, por ejemplo

> https:pokeapi.co/api/v2/pokemon/4

- Selecciono la opción view as RAW json ( o uso alguna aplicación para verlo en modo json)
- Copio todo el json
- En quickType.io coloco el nombre de la interfaz (Pokemon) en el primer campo de la columna izquierda
  - Abajo pego todo el json
  - En el gizmo de top-right me aseguro de tener seleccionado Typescript y Interfaces only
  - Se generan las interfaces necesarias
- También se puede usar una extensión de VSCode! (Quicktype.io extension)

~~~ts
getPokemon(4)
    then(pokemon=> console.log(pokemon.sprites)) //Ahora tengo toda la info de la respuesta disponible gracias a la interfaz
~~~
----

## Quicktype.io extension

- Sigo necesitando la respuesta en json copiada con ctrl + c
- La extensión es Paste JSON as Code
- Voy al command Palette (ctrl + shift + P) y busco Paste json as code
- Me pregunta el top-level, le pongo Pokemon y Enter
- Ya tengo la interfaz completa de Pokemon