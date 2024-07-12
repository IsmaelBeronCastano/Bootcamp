# Redux React Typescript Grider

- Vamos a crear un input donde el usuario/a va a escribir el nombre de un paquete y al darle al botón Submit vamos a hacer una búsqueda con la API de npm
- Instalo:

> npm i --save-exact react-redux redux @types/react-redux redux-thunk@2.3.0 axios@0.21.1
----

## Redux Store Design

- Cuando trabajes con redux, date un tiempo para pensar en el diseño
- Para hacer una búsqueda de un paquete llamado bootstrap, esta sería la url que usaríamos

> registry.npmjs.org/-/v1/search?text=bootstrap

- Puedo analizar la respuesta colocando la url en el navegador
- En el objeto objects tengo un arreglo con el nombre de los paquetes, la versión, scope, descripción, keywords....
- Vamos a hacer fetch a 'packages' de NPM
  - 'package' es una palabra reservada en TS, por lo que vamos a llamar a los NPM packages 'repositories'
- Entonces esta va a ser la Store
- **Repositories**
  - **Data**: Lista de repos en NPM
  - **Loading**: true/false mientras hacemos el fetching de la data
  - **Error**: mensaje de error si ocurre algo durante el fetching
- Tenemos una pieza de state llamada Repositories
- Esta pieza del state estará producida por un repositories reducer
- Este reducer tendrá 3 propiedades dentro
- Pensemos en los diferentes **Action Creators**. Solo necesitamos una
  - searchRepositories(name)
  - Este searchrepositories va a hacer el **dispatch** de varias **acciones**
    - Actions:
      - SearchRepositories
      - SearchRepositoriesSuccess
      - SerachRepositoriesError
    - Necesitamos los tipos para estas acciones para poder identificarlas dentro del reducer
    - Action Types:
      - 'search_repositories'
      - 'search_repositories_success'
      - 'search_repositories_error'
- Podemos estructurar el árbol de directorios con un /src y dentro la carpeta components y otra con todo lo de redux
- En la carpeta de redux añadiremos un archivo de barril index.ts para tener todo lo de redux disponible en un solo archivo 
------

## Reducer Setup

- Vamos a empezar escribiendo puro Vanilla JavaScript
- Un reducer llamado repositories con tres piezas de state: data, loading, error
- Creo la carpeta state en src/
- Dentro de state creo la carpeta /reducers con el archivo repositoriesReducers.ts
- El reducer va a recibir los argumentos de state o el último state que el reducer corrió, y la acción que necesitamos procesar
- Debemos de retornar un state que sea un objeto que tenga esas 3 propiedades (data, loading, error)
- Creo una interfaz para el state
- Para el action le pongo tipo any, de momento
- El reducer siempre tiene un switch y siempre debe devolver un state, por lo que retorno el state como valor default
- Los casos del switch son los ActionTypes descritos anteriormente
  - 'search_repositories'
  - 'search_repositories_success'
  - 'search_repositories_error'
- En search repositories pongo el loading a true, error en null y declaro la data como un arreglo vacío
- En el caso succes, la data será el action.payload
- En el caso de error seteo el error con el action.payload y la data con un arreglo vacío

~~~js
interface RepositoriesState{
    loading: boolean
    error: string | null
    data: string[] //vamos a decir que el listado de paquetes de NPM es un array de strings
}


const reducer = (state: RepositoriesState, action:any)=>{
    switch (action.type){
        case 'search_repositories':
            return {loading: true, error: null, data: []}
        case 'search_repositories_success':
            return {loading: false, error: null, data: action.payload}
        case 'search_repositories_error': 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~

- Esto es puro JavaScript, no estoy aprovechando **TypeScript**
- Si quiero pasar la data en el switch como un objeto en lugar de un arreglo no me da problema. 
- Action es de tipo *any*
------

## Annotating de Return Type

- El reducer siempre va a devolver algo de tipo *RepositoriesState*, lo anoto en el reducer
- Esto ya nos asegura de que la data que devuelva será un array vacío o un array de strings, pero un array!
----

## Typing an Action

- La action siempre tendrá un *type* y opcionalmente un *payload*
- Creo la interfaz y tipo el parámetro *any* del reducer

~~~js

interface RepositoriesState{
    loading: boolean
    error: string | null
    data: string[] //vamos a decir que el listado de paquetes de NPM es un array de strings
}

interface Action{
    type: String
    payload?: any
}


const reducer = (state: RepositoriesState, action:Action): RepositoriesState=>{
    switch (action.type){
        case 'search_repositories':
            return {loading: true, error: null, data: []}
        case 'search_repositories_success':
            return {loading: false, error: null, data: action.payload}
        case 'search_repositories_error': 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~

- Pero el payload sigue siendo *any*!
----

## Separate Interfaces for Actions

- Tenemos tres posibles acciones, en dos de ellas recibimos una respuesta en el payload
  - SearchRepositories Action : { type: 'search_repositories' }
  - SearchRepositoriesSuccess Action :{ type: 'search_repositories_success', payload:['react', 'react-dom'] }
  - SearchRepositoriesError Action: { type: 'search_repositories_error', payload: 'Request Failed' }
- Vamos a hacer una interfaz por cada acción
- Borro la interfaz Action

~~~js
interface SearchRepositoriesAction{
    type: 'search_repositories'
}

interface SearchRepositoriesSuccessAction{
    type: 'search_repositories_success',
    payload: string[]
}

interface SearchRepositoriesErrorAction{
    type: 'search_repositories_error',
    payload: string
}
~~~
----

## Applying Action Interfaces

- Digo que el action puede ser cualquiera de estas interfaces con los union types |

~~~js

interface RepositoriesState{
    loading: boolean
    error: string | null
    data: string[] //vamos a decir que el listado de paquetes de NPM es un array de strings
}

interface SearchRepositoriesAction{
    type: 'search_repositories'
}

interface SearchRepositoriesSuccessAction{
    type: 'search_repositories_success',
    payload: string[]
}

interface SearchRepositoriesErrorAction{
    type: 'search_repositories_error',
    payload: string
}

const reducer = (state: RepositoriesState, 
    action: SearchRepositoriesAction  
            | SearchRepositoriesSuccessAction  
            | SearchRepositoriesErrorAction
            ): RepositoriesState=>{
    
        switch (action.type){
        case 'search_repositories':
            return {loading: true, error: null, data: []}
        case 'search_repositories_success':
            return {loading: false, error: null, data: action.payload}
        case 'search_repositories_error': 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~

- De esta manera yo sé que si cumple con un action.type determinado satisface una de las tres interfaces
- Una forma de escribir este *Type Guard* sería con un if

~~~js
 if(action.type === 'search_repositories_success'){
            action.payload  //será un array de strings, satisface la interfaz
        }
~~~

- Pero no hace falta porque en este caso el switch hace de *Type Guard* con cada *case*
----

## Adding an Action Type Enum

- En lugar de escribir los tipos de las acciones con el nombre de las interfaces declaro el tipo Action
- Declaro el action del reducer como Action

~~~js
type Action = 
    | SearchRepositoriesAction  
    | SearchRepositoriesSuccessAction  
    | SearchRepositoriesErrorAction
~~~

- Tenemos strings repetidos en interfaces y cases del switch
- Puedo colocarlos en un enum
- Ahora puedo sustituir las strings de los cases e interfaces por los valores del enum
- 
~~~js

interface RepositoriesState{
    loading: boolean
    error: string | null
    data: string[] //vamos a decir que el listado de paquetes de NPM es un array de strings
}

interface SearchRepositoriesAction{
    type: ActionType.SEARCH_REPOSITORIES
}

interface SearchRepositoriesSuccessAction{
    type: ActionType.SEARCH_REPOSITORIES_SUCCES,
    payload: string[]
}

interface SearchRepositoriesErrorAction{
    type: ActionType.SEARCH_REPOSITORIES_ERROR,
    payload: string
}

type Action = 
    | SearchRepositoriesAction  
    | SearchRepositoriesSuccessAction  
    | SearchRepositoriesErrorAction

enum ActionType {
    SEARCH_REPOSITORIES= 'search_repositories',
    SEARCH_REPOSITORIES_SUCCES= 'search_repositories_success',
    SEARCH_REPOSITORIES_ERROR= 'search_repositories_error'
}

const reducer = (state: RepositoriesState, 
    action: Action
            ): RepositoriesState=>{

       
    
        switch (action.type){
        case ActionType.SEARCH_REPOSITORIES:
            return {loading: true, error: null, data: []}
        case ActionType.SEARCH_REPOSITORIES_SUCCES :
            return {loading: false, error: null, data: action.payload}
        case ActionType.SEARCH_REPOSITORIES_ERROR: 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~
----

## A Better Way to Reorganize the Code

- En src/state creo un nuevo directorio llamado actions con index.ts
- Copio interfaces y el type Action en el index.ts
- En otra carpeta en src/state/action-types creo otro index.ts con el enum (y lo exporto)
- Arreglo los imports y exports del reducer, queda así

~~~js
import { ActionType } from "../action-types"
import { Action, RepositoriesState } from "../actions"


const reducer = (state: RepositoriesState, action: Action): RepositoriesState=>
{
        switch (action.type){
        case ActionType.SEARCH_REPOSITORIES:
            return {loading: true, error: null, data: []}
        case ActionType.SEARCH_REPOSITORIES_SUCCES :
            return {loading: false, error: null, data: action.payload}
        case ActionType.SEARCH_REPOSITORIES_ERROR: 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~

- Este enum puede crecer indefinidamente
- Si necesitamos más interfaces podemos agregar otro archivo
- Ahora debemos crear un **actionCreators** con SearchRepositories(term) que haga el request a la API de node y despache una acción, SearchRepositories, Success o Error
------

## Adding Action Creators

- Creo la carpeta en src/state/**action-creators** con un index.ts
- No necesariamente tenemos que escribir todos al action creators en el index, se puede organizar en diferentes archivos
- Importo axios, el ActionType y el Action
- Vamos a usar un **redux-thunk** para usar una función asíncrona ya que vamos a hacer una consulta a una API
- Si estoy haciendo una consulta, lo primero que quiero es disparar la accion de loading en true
- Coloco la consulta en un try catch por si falla
- En el error despacho el tipo error y le paso el error.message en el **payload**
- En el try hago la consulta con axios
- En la petición get de axios, le paso como segundo parámetro un objeto con el parámetro en el texto del params (para la búsqueda)
- Esta data que desestructuro, si observamos la respuesta JSON de la API obtengo objects que es un array de objetos
  - Cada objeto se llama package que es a su vez un objeto con las propiedades name, scope, version, description, keywords
- Hago un .map de data.objects, lo guardo en names y hago un dispatch del success pasándole el names en el payload

~~~js
import axios from "axios";
import { ActionType } from "../action-types";
import { Action } from "../actions";


export const searchRepositories = (term: string ) =>{
                  //dispatch esta tipado como any, por lo que no infiere en los tipos de las acciones que dispara
    return async  (dispatch: any)=>{
        dispatch({
            type: ActionType.SEARCH_REPOSITORIES
        })

        try {
           const {data} = await axios.get(`https://registry.npmjs.org/-/v1/search`,{
                params: {
                    text: term
                }
           }) 

           const names = data.objects.map((result: any)=>{
                return result.package.name
           })

           dispatch({
            type: ActionType.SEARCH_REPOSITORIES_SUCCES,
            payload: names //como dispatch es any, aquí puedo poner cualquier cosa y no se queja
           })
            
        } catch (error) {
            if(error instanceof Error){
                dispatch({
                    type: ActionType.SEARCH_REPOSITORIES_ERROR,
                    payload: error.message
                })
            }
        }
    }
}
~~~
----

## Applying Typings to Dispatch

- En este momento yo puedo cambiar el payload del dispatch de *REPOSITORIES_SUCCES* por un número y TypeScript **no se queja**
- Para que Typescript infiera en los tipos de las acciones debo cambiar el tipo any del parámetro dispatch en la función async del return de *SearchRepositories*
- Importo Dispatch from 'redux', digo que Dispatch es de tipo Dispatch y le paso como genérico el Action (que es el tipo con todas las interfaces de mis acciones)

~~~js
import axios from "axios";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Dispatch } from "redux";

export const searchRepositories = (term: string ) =>{
                            //tipo Dispatch y le paso como genérico Action
    return async  (dispatch: Dispatch<Action>)=>{
        dispatch({
            type: ActionType.SEARCH_REPOSITORIES
        })

        try {
           const {data} = await axios.get(`https://registry.npmjs.org/-/v1/search`,{
                params: {
                    text: term
                }
           }) 

           const names = data.objects.map((result: any)=>{
                return result.package.name
           })

           dispatch({
            type: ActionType.SEARCH_REPOSITORIES_SUCCES,
            payload: names
           })
            
        } catch (error) {
            if(error instanceof Error){
                dispatch({
                    type: ActionType.SEARCH_REPOSITORIES_ERROR,
                    payload: error.message
                })
            }
        }
    }
}
~~~
------

## Setting Up Exports

- **NOTA:** En esta lección veremos cómo **createStore** está deprecado y el editor te anima a usar Redux Toolkit y su *configureStore*, cuando se hizo este curso se propuso usar redux plano sin abstracciones
- Ahora hay que poner todo junto y crear la Store
- Creo un index.ts en src/state/reducer
- src/state/reducers/index.ts

~~~js
import { combineReducers } from "redux";
import repositoriesReducer from "./repositoriesReducer";

const reducers = combineReducers({
    repositories: repositoriesReducer
})

export default reducers
~~~

- Dentro de /state creo el store.ts

~~~js
import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'


export const store = createStore(reducers, {}, applyMiddleware(thunk))
~~~

- Para facilitar las cosas creo un index.ts dentro de /state
- /state/index.ts

~~~js
export  *  from './store'
export  *  as actionCreators from './action-creators'
~~~
-----

## Wiring Up to React

- Vamos a conectar todo
- En App importo **Provider** from 'react-redux'
- Importo todo del store
- Creo el **Provider**, le paso el **store**
- Dentro renderizo un componente que todavía no he creado **RepositoriesList**

~~~js
import { Provider } from "react-redux"
import { store } from "./state"
import RepositoriesList from "./components/RepositoriesList"

const App=()=> {


  return (
    <Provider store={store} >
      <div>
        <h1>Search for a Package</h1>
        <RepositoriesList />
      </div>

    </Provider>
  )
}

export default App
~~~

- En RepositoriesList

~~~js
const RepositoriesList: React.FC = () => {
  return (
    <div>
      <form>
        <input type="text" />
        <button>Search</button>
      </form>
    </div>
  )
}

export default RepositoriesList
~~~

- Ahora solo nos falta una *pequeña cosa* que es **añadir un state inicial al reducer**
----

## Initial State!

- Le añado un initialState

~~~js
import { ActionType } from "../action-types"
import { Action, RepositoriesState } from "../actions"

const initialState = {
    loading: false,
    error: null,
    data: []
}

const reducer = (state: RepositoriesState= initialState, action: Action): RepositoriesState=>
{
        switch (action.type){
        case ActionType.SEARCH_REPOSITORIES:
            return {loading: true, error: null, data: []}
        case ActionType.SEARCH_REPOSITORIES_SUCCES :
            return {loading: false, error: null, data: action.payload}
        case ActionType.SEARCH_REPOSITORIES_ERROR: 
            return {loading: false, error: action.payload, data: []}
        default: 
            return state
    }
}

export default reducer
~~~
-----

## Reminder on Event Types

- Basic stuff
  - Necesito añadir un state para capturar lo que el usuario/a meta en el input
  - En el form necesito una función de submit que llame al *actionCreators*
  - Necesito extraer un state de redux en el componente y listar los paquetes
- En el *value* del input le paso el state (term)
- En el *onChange* añado el callback con el setTerm para guardar el *e.target.value* en el state
- En el form creo el onSubmit
- Le paso el *e.preventDefault*
- Para saber el tipo del e pongo el cursor encima del onSubmit (puedo tipar la función o el vento, si tipo la funcion es un Handler)

~~~js
import { useState } from "react"

const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')

  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
    </div>
  )
}

export default RepositoriesList
~~~
- **NOTA:** Para evitar el error de la próxima lección, debido a unos updates en React Redux, tipar como any

> dispatch(actionCreators.searchRepositories(term) as any)
-----

## Calling an Action Creator

- Importo **useDispatch** de *react-redux*
- **useDispatch** me da la opción de disparar el dispatch para disparar un *Action Creator* dentro de un componente
- Debo importar el **actionCreators** del state/index.ts

~~~js
import { useState } from "react"
import { useDispatch } from "react-redux"
import {actionCreators} from "../state"


const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')

  const dispatch = useDispatch()

  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
    dispatch(actionCreators.searchRepositories(term)as any)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
    </div>
  )
}

export default RepositoriesList
~~~

- Vamos a mejorar este código del dispatch, pero antes vamos a probar que funcione! Escribo react en el input del navegador
- Le doy al botón, voy a la consola, Network, Fetch/XHR, clico en la petición search?text=react, en Preview veo la respuesta
----

## Binding Action Creators

- Vamos a crear un hook que nos de acceso a todos los *actionCreators*
- Creo en /src el directorio hooks con useActions.tsx
- Importo **useDispatch** de react-redux
- Importo **bindActionCreators** de redux
- Importo **actionCreators**
- El *useDispatch* solo me garantiza que voy a poder usar el dispatch. Esto me habilita para disparar acciones de mis diferentes reducers
- A *bindActionCreators* le paso como primer parámetro el objeto que contiene los diferentes métodos
- Cómo segundo parámetro  le paso el dispatch
- useAction.tsx

~~~js
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

export const useActions = ()=>{
    const dispatch = useDispatch()

  return  bindActionCreators(actionCreators, dispatch)
         //{searchRepositories: dispatch(searcRepositories)}
}
~~~

- Reemplazo el *useDispatch* y el *actionCreators* del componente *RepositoriesList* por **useActions**
- Desestructuro el **searchRepositories** del **useAction**
- Lo llamo en el onSubmit y le paso el term

~~~js
import { useState } from "react"
import { useActions } from "../hooks/useActions"


const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')
  //desestructuro searchRepositories de useActions
  const {searchRepositories} = useActions() 


  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
    
    //solo tengo que llamarlo y pasarle el term
    searchRepositories(term)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
    </div>
  )
}

export default RepositoriesList
~~~

- Ahora solo falta mapear la respuesta y mostrarla en el componente
------

## Selecting State

- Necesitamos acceso a algún state de nuestro reducer dentro de mi componente *RepositoriesList* 
- Para esto usaré el hook **useSelector** de react-redux
- **useSelector** me devuelve el **state de mi store**

~~~js
const state = useSelector((state)=>state) //console.log(state) me devuelve el state de mi store
console.log(state)
~~~

- En el console.log puedo ver que en data tengo lo que me interesa
- Para eso sirve el callback del useSelector
- Tipo el state como any momentáneamente

~~~js
const state = useSelector((state: any)=>state.repositories) 
~~~

- Puedo usar desestructuración

~~~js
const {data, error, loading} = useSelector((state: any)=>state.repositories) 
~~~

- useSelector no tiene idea de que tipo es la data de tu store
- Hay que escribir algo más de código
----

## Awkward Typings Around React-Redux

- Sabemos que mi estado es una pieza de estado llamada repositories con otras tres llamadas data, loading, y error
- React-redux no sabe de esta info
- Si coloco el cursor encima de useSelector me aparece el tipo DefaultRootState
- En la documentación de React-redux, en Static Typing, aparece Defining the Root State Type
- Debo describir el tipo del state del store
- TypeScript sabe el tipo de dato que almacena el reducer. Sabe que (en este caso) es de tipo RepositoriesState
- reducers/index.ts

~~~js
import { combineReducers } from "redux";
import repositoriesReducer from "./repositoriesReducer";

const reducers = combineReducers({
    repositories: repositoriesReducer
})

export default reducers

export type RootState = ReturnType<typeof reducers>
~~~
- Hago la exportación por defecto en el state/index.ts

~~~js
export  *  from './store'
export  *  as actionCreators from './action-creators'
export  *  from './reducers'
~~~

- Creo un nuevo archivo tsx en /hooks/useTypedSelector.tsx

~~~js
import { useSelector, TypedUseSelectorHook } from "react-redux";
import  {RootState} from '../state'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
~~~

- RepositoriesList.tsx

~~~js
import { useState } from "react"
import { useActions } from "../hooks/useActions"
import { useTypedSelector } from "../hooks/useTypedSelector"



const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')
  //desestructuro searchRepositories de useActions
  const {searchRepositories} = useActions()

                                //cambio el useSelector por el useTypedSelector que he creado. Ahora sabe de que tipo es el state
  const {data, error, loading} = useTypedSelector((state)=>state.repositories) 

  console.log(data, error, loading)


  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
    
    //solo tengo que llamarlo y pasarle el term
    searchRepositories(term)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
    </div>
  )
}

export default RepositoriesList
~~~
------

## Consuming Store State

- Si no tengo error y no tengo loading imprimo la data

~~~js
import { useState } from "react"
import { useActions } from "../hooks/useActions"
import { useTypedSelector } from "../hooks/useTypedSelector"



const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')
  //desestructuro searchRepositories de useActions
  const {searchRepositories} = useActions()

                                //cambio el useSelector por el useTypedSelector que he creado. Ahora sabe de que tipo es el state
  const {data, error, loading} = useTypedSelector((state)=>state.repositories) 

  console.log(data)


  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
    
    //solo tengo que llamarlo y pasarle el term
    searchRepositories(term)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
      {error && <h3>{error}</h3>}
      {loading && <h3>Loading...</h3>}
      {!error && !loading  &&
      data.map(name=>(
        <div key={name}>
          <h3>{name}</h3>
        </div>
      ))} 
    </div>
  )
}

export default RepositoriesList
~~~

- Hemos hecho todas las importaciones de redux en un archivo de barril
- Comunicar los tipos entre los componentes es un poco lioso. Vas a necesitar TypedUseSelectorHook
- Usar los tipos de redux-thunk es más complicado aún que lo hecho aquí!!






