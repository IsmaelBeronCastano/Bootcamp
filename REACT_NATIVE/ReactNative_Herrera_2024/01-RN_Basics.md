# 01 REACT NATIVE - BASICS

- Para crear el proyecto

> npx react-native@latest init Proyecto

## Zustand - Gestor de estado

- En src creo las carpetas api, components, hookes, interfaces, **store**
- Para instalar

> npm i zustand

- Para crear el store global creo en /store/**auth.store.ts** una interfaz con los tipos de lo que voy a guardar en el stado
- Importo create de zustand y le paso el AuthState. Luego abro dos pares de paréntesis, y dentro del segundo par coloco un callback que devuelve un objeto entre paréntesis (return implícito)
- El argumento set me servirá para disparar la creación de un nuevo estado
- Podría colocar solo el status porque las otras dos propiedades son opcionales. En el momento inicial no tengo usuario ni user, le pongo undefined

~~~js
import {create} from 'zustand'

interface AuthState{
    status: 'authenticated' | 'unauthenticated' | 'checking'
    token?: string
    user?:{
        name: string
        email: string
    }
}

export const useAuthStore = create<AuthState>()((set)=>({
    status: 'checking',
    token: undefined,
    user: undefined
}))
~~~

- Ahora tengo acceso a este useAuthStore desde cualquier lugar, no necesito envolver nada en providers ni similares
- Creo en components/**LoginPage.tsx**, lo renderizo en **App**

~~~js
import React from 'react'
import { useAuthStore } from '../store/auth.store'
import { Text, View } from 'react-native'

const LoginPage = () => {

    const status = useAuthStore(state=> state.status)

  return (
    <View>
        <Text>{status}</Text>
    </View>
  )
}

export default LoginPage
~~~

- Para poner en marcha el proyecto uso **npm run start**
- **NOTA:** si da problemas con el HOME de JAVA colocar en gradle.properties el path dónde se encuentra JAVA (solución temporal)

~~~
org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
~~~
-----

## Login

- Puedo renderizar condicionalmente un Loading

~~~js
import React from 'react'
import { useAuthStore } from '../store/auth.store'
import { Text, View } from 'react-native'

const LoginPage = () => {

    const authStatus = useAuthStore(state=> state.status)

    if(authStatus=== 'checking'){
      return <View>
              <Text>Loading...</Text>
              </View>
    }

  return (
    <View>
        <Text>{authStatus}</Text>
    </View>
  )
}

export default LoginPage
~~~

- Los métodos en zustand pueden ser async
- Creo los métodos login y logout
- Suponiendo que el login se valida en algún backend, usamos el set para regresar un nuevo estado

~~~js
import {create} from 'zustand'

interface AuthState{
    status: 'authenticated' | 'unauthenticated' | 'checking'
    token?: string
    user?:{
        name: string
        email: string
    }
    login : (email: string,password: string) => void
    logout: ()=> void
}

export const useAuthStore = create<AuthState>()((set)=>({
    status: 'checking',
    token: undefined,
    user: undefined,
    
    login: (email: string,password: string) => {
        set({
            status: 'authenticated',
            token: 'abc123',
            user:{
                name: 'John Doe',
                email: 'john@example.com'
            }
        })
    },
    
    logout: ()=>{
        set({
            status: 'unauthenticated',
            token: undefined,
            user: undefined
        })
    }

}))
~~~

- No estoy usando el password (por ahora)
- Para tomar las funciones puedo usar desestructuración para extraer todo en una sola linea
- **Pero zustand recomienda hacerlo por separado**, ya que si no puede disparar rerenders innecesarios
- Coloco un useEffect con un setTimeOut para llamar al logout y quitar el Loading... al estar checking
- Renderizo condicionalmente el user.
    - Al tratarse de un objeto uso JSON.stringify con el user, el replacement en null y un espacio de 2

~~~js
import React, { useEffect } from 'react'
import { useAuthStore } from '../store/auth.store'
import { Text, View } from 'react-native'

const LoginPage = () => {

    const authStatus = useAuthStore(state=> state.status)
    const user = useAuthStore(state => state.user)
    const login = useAuthStore(state => state.login)
    const logout = useAuthStore(state => state.logout)

    useEffect(()=>{
      setTimeout(()=>{
        logout();
      }, 1500)
    }, [])

    if(authStatus=== 'checking'){
      return <View>
              <Text>Loading...</Text>
              </View>
    }

  return (
    <View>
        <Text>Login Page</Text>
        {(authStatus === 'authenticated')
        ? <Text>Autenticado como : {JSON.stringify(user, null, 2)}</Text>
        : <Text>No autenticado</Text> 
        }
    </View>
  )
}

export default LoginPage
~~~

- Hago la misma condición para mostrar un botón de logout y login
- Como le paso argumentos al login lo llamo con un callback

~~~js
return (
    <View>
        <Text>Login Page</Text>
        {(authStatus === 'authenticated')
        ? <Text>Autenticado como : {JSON.stringify(user, null, 2)}</Text>
        : <Text>No autenticado</Text> 
        }

        {(authStatus === 'authenticated')
        ? <View><Button  title="logout" onPress={logout}/></View>
        : <View><Button  title="login" onPress={()=>login("mail@example.com", "1234")}/></View>
      }
    </View>
  )
~~~

- Zustand es muy útil. Se verá más durante el curso
-----

## Peticiones HTTP - Axios

- Creo UsersPage en /components
- Usaremos la web reqres.in
- Primero lo haremos con fetch

~~~js
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

const UsersPage = () => {

    useEffect(()=>{
        fetch("https://reqres.in/api/users?page=2")
        .then(resp=> resp.json())
        .then(data=> console.log(data))
    }, [])

  return (
    <View>
        <Text>Usuarios</Text>
        <Text>Nombre</Text>
        <Text>Email</Text>
    </View>
  )
}

export default UsersPage
~~~

- Ahora con axios!
- Por defecto la respuesta de axios es de tipo any
- Para tiparla podemos ir a la url, copiar la data y usar la aplicación de Paste JSON as code para sacar la interfaz
~~~js
export interface ReqUserListResponse {
    page:        number;
    per_page:    number;
    total:       number;
    total_pages: number;
    data:        User[];
    support:     Support;
}

export interface User {
    id:         number;
    email:      string;
    first_name: string;
    last_name:  string;
    avatar:     string;
}

export interface Support {
    url:  string;
    text: string;
}
~~~

- Llamo a get con axios
- Tipándolo ahora obtengo las opciones disponibles de resp.data.

~~~js
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'
import { ReqUserListResponse } from '../interfaces/DataAxios'

const UsersPage = () => {

    useEffect(()=>{
      axios.get<ReqUserListResponse>("https://reqres.in/api/users?page=2")
      .then(resp=> console.log(resp.data))
    }, [])

  return (
    <View>
        <Text>Usuarios</Text>
        <Text>Nombre</Text>
        <Text>Email</Text>
    </View>
  )
}

export default UsersPage
~~~

- el código que no tiene que estar necesariamente en el componente normalmente se exporta a otro archivo
- Las peticiones http suelen ir en archivos aparte o en una función

~~~js
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'
import { ReqUserListResponse } from '../interfaces/DataAxios'


const loadUsers = async ()=>{
  try {
    const {data} = await axios.get<ReqUserListResponse>("https://reqres.in/api/users") //axios regresa data por defecto
    return data.data //.data porque es dónde están los Users[]
    
  } catch (error) {
    console.log(error)
    return 
  }
}

const UsersPage = () => {


    useEffect(()=>{
     loadUsers().then(users=>console.log(users))
    }, [])

  return (
    <View>
        <Text>Usuarios</Text>
        <Text>Nombre</Text>
        <Text>Email</Text>
    </View>
  )
}

export default UsersPage
~~~
-----

## Mostrar usuarios

- Lo haremos con un useState, podríamos hacerlo con zustand
- Puedo tipar loadUsers como una promesa que devuelve un arreglo de User, retorno un arreglo vacío en el catch
- Lo mismo puedo tipar el useState con User[]
- Cuando tengo un argumento (o varios) que es pasado a la función que llama el callback, puedo poner solo la función (sin invocarla)
- Ahora ya tengo los users en una pieza de state
- En React Native usaríamos una FlatList
- Hago un map de los users del state, **le paso el key que debe de ser un string**, renderizo en un Text el nombre en **renderItems**
- Por supuesto podría crear otro componente para renderizar en renderItems con last_name, avatar, etc
- Renderizo UsersPage en App

~~~js
import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import axios from 'axios'
import { ReqUserListResponse, User } from '../interfaces/DataAxios'


const loadUsers = async (): Promise<User[]>=>{
  try {
    const {data} = await axios.get<ReqUserListResponse>("https://reqres.in/api/users") //axios regresa data por defecto
    return data.data //.data porque es dónde están los Users[]
    
  } catch (error) {
    console.log(error)
    return []
  }
}

const UsersPage = () => {

  const [users, setUsers] = useState<User[]>([])

    useEffect(()=>{
     loadUsers().then(setUsers) //le paso el arreglo de users al state
    }, [])

  return (
    <View>
      <FlatList 
        data= {users.map(({email, first_name})=>({
            key: email,
            first_name            
        }))}
        renderItem={({item})=><Text>{item.first_name}</Text>}
      />
    </View>
  )
}

export default UsersPage
~~~
------

- Podemos crear una paginación con un par de botones
- En el caso de esta reqres.in, solo hay hasta página 2, la página 3 regresa 0 resultados
- Para acceder a la página 2 sólo hay que añadir a la url "/users?page=2"
- Podemos hacerlo a través de la url o el objeto de configuración de axios
- Puedo decir que recibo la página como parámetro de loadUsers y si no recibo nada es 1 por defecto
- Le paso el valor page al objeto params: page
- Uso useRef para saber en que página me encuentro, la inicio en 1
- Le paso el ref.current a loadUsers
- Para llamar a la siguiente página creo la función nextPage y prevoiusPage
- En nextPage, si el arreglo.length es mayor que cero se lo paso al state. Si no que vuelva a la página anterior
- En el previousPage establezco la condición para que si es la página 1 no pueda seguir descendiendo

~~~js
import React, { useEffect, useRef, useState } from 'react'
import { Button, FlatList, Text, View } from 'react-native'
import axios from 'axios'
import { ReqUserListResponse, User } from '../interfaces/DataAxios'


const loadUsers = async (page: number = 1): Promise<User[]>=>{
  try {
    const {data} = await axios.get<ReqUserListResponse>("https://reqres.in/api/users",{
      params:{
        page: page
      }
    }) 
    return data.data
    
  } catch (error) {
    console.log(error)
    return []
  }
}

const UsersPage = () => {

  const [users, setUsers] = useState<User[]>([])
  const currentPageRef = useRef(1)

  const nextPage = async () =>{
    currentPageRef.current ++;
    
    const users = await loadUsers(currentPageRef.current)
    if(users.length > 0){
      setUsers(users)
    }else{
      currentPageRef.current --;
    }
  }

  const previousPage = async () =>{
    if(currentPageRef.current < 1) return
      
    currentPageRef.current --;
    const users = await loadUsers(currentPageRef.current)
    setUsers(users)
  }

    useEffect(()=>{
     loadUsers(currentPageRef.current).then(setUsers)
    }, [])

  return (
    <View>
      <FlatList 
        data= {users.map(({email, first_name})=>({
            key: email,
            first_name            
        }))}
        renderItem={({item})=><Text>{item.first_name}</Text>}
      />

      <Button title="Previous" onPress={previousPage} />
      <Button title="Next" onPress={nextPage} />

    </View>
  )
}

export default UsersPage
~~~
----

## Custom Hook - useUsers

- Cuando hay tanto código hay que modularizar para que sea más legible
- Muevo todo el código encima del return de UsersPage a useUsers
- Hago las importaciones necesarias, retorno las funciones nextPage, previousPage y users

~~~js
import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ReqUserListResponse, User } from '../interfaces/DataAxios'
import axios from 'axios'

const loadUsers = async (page: number = 1): Promise<User[]>=>{
    try {
      const {data} = await axios.get<ReqUserListResponse>("https://reqres.in/api/users",{
        params:{
          page: page
        }
      }) 
      return data.data
      
    } catch (error) {
      console.log(error)
      return []
    }
  }
  
const useUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const currentPageRef = useRef(1)

  const nextPage = async () =>{
    currentPageRef.current ++;
    
    const users = await loadUsers(currentPageRef.current)
    if(users.length > 0){
      setUsers(users)
    }else{
      currentPageRef.current --;
    }
  }

  const previousPage = async () =>{
    if(currentPageRef.current < 1) return
      
    currentPageRef.current --;
    const users = await loadUsers(currentPageRef.current)
    setUsers(users)

  }

    useEffect(()=>{
     loadUsers(currentPageRef.current).then(setUsers)
    }, [])

    return {
        nextPage,
        previousPage,
        users
    }
}

export default useUsers
~~~

- Ahora solo tengo que desestructurar la info del custom hook en UsersPage

~~~js
const {nextPage, previousPage, users} = useUsers()
~~~

