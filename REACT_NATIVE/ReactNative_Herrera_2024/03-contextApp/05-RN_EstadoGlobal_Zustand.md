## REACT NATIVE - COMPARTIR ESTADO GLOBAL ZUSTAND

- Practiquemos como comunicar componentes con Zustand
- **NOTA**: si da problemas *evaluating project ':app'* indicar donde se encuentra java en gradle.properties

~~~
org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
~~~

- Creo src/Main.tsx

~~~js
import React from 'react'
import { Text, View } from 'react-native'

export const Main = () => {
  return (
    <View>
        <Text>Hello world!</Text>
    </View>
  )
}
~~~

- Lo renderizo en index.js en lugar de App

~~~js
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './App';
import {name as appName} from './app.json';
import { Main } from './src/Main';

AppRegistry.registerComponent(appName, () => Main);
~~~

- Creo la estructura de directorios
    - presentation
        - store
        - screens
            - home/HomeScreen.tsx
            - profile/ProfileScreen.tsx
            - settings/SettingsScreen.tsx
    - config/appTheme.tsx
- Creo en appTheme los estilos globales

~~~js
import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 20,
    marginTop: 10
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },

  primaryButton:{
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10
  }
})
~~~

- Aplico los estilos de los containers a los View de SettingsScreen, ProfileScreen y HomeScreen
- Configuro el BottomTabNavigator para mostrar estos tres componentes

> npm install @react-navigation/native @react-navigation/native-stack
> npm install react-native-screens react-native-safe-area-context
> npm install @react-navigation/bottom-tabs

- Creo la carpeta presentation/routes/BottomTabNavigator.tsx

~~~js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreens';
import Settingsscreen from '../screens/settings/Settingsscreen';
import { ProfileScreen } from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator=()=>{
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={Settingsscreen} />
    </Tab.Navigator>
  );
}
~~~

- Envuelvo el Main en un NavigationContainer

~~~js
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { BottomTabNavigator } from './presentation/routes/BottomTabNavigator'

export const Main = () => {
  return (
   <NavigationContainer>
      <BottomTabNavigator />
   </NavigationContainer>
  )
}
~~~
----

## Zustand - Gestor de estado


> npm i zustand

- Creo en store/profile-store.tsx
- Para crear un store usamos la funcion create de Zustand, lo usaremos como un hook
- Usamos una interfaz para tiparlo y doble paréntesis ( uno para el tipado y otro para el callback)
- Notar que el callback envuelve las llaves en paréntesis para hacer implícito el return
- **set** es el dispatch ( o la función ) que debo llamar para cambiar los valores de mi store
- **get** me va a permitir obtener el store

~~~js
import { create } from "zustand"


interface ProfileState{
    name: string
    email: string
}

export const useProfileStore = create<ProfileState>()((set, get)=>({
    name: 'Bill Murray',
    email: "billybilly@gmail.com"
}))
~~~

- En ProfileScreen renderizo el estado
- Puedo usar desestructuración pero a veces dispara rerenders indeseados

~~~js

import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../../config/appTheme'
import { useProfileStore } from '../store/profile-store'

export const ProfileScreen  = () => {

  const name = useProfileStore(get=> get.name)
  const email = useProfileStore(get=> get.email)

  return (
    <View style={styles.container} >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>{email}</Text>
    </View>
  )
}
~~~
-----

## Cambios en el Store

- En ProfileScreen creo un par de botones
- En el onPress, llamando en el callback a useProfileStore tengo **subscribe** y estar suscrito a los cambios del state
- Tengo el **setState** y el **getState**
- Prefiero crear las funciones que voy a usar en el store para que la lógica siempre esté definida en mi store 
- No siempre es la mejor opción, a criterio del desarrollador/a

~~~js

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { styles } from '../../config/appTheme'
import { useProfileStore } from '../store/profile-store'

export const ProfileScreen  = () => {

  const name = useProfileStore(get=> get.name)
  const email = useProfileStore(get=> get.email)

  return (
    <View style={styles.container} >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>{email}</Text>

      <Pressable style={styles.primaryButton} 
      onPress={()=>useProfileStore.setState({name: "Miguel Castaño"})}
      >
        <Text style={styles.title}>Cambio Nombre</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} 
      onPress={()=> useProfileStore.setState({email: "migue@gmail.com"})}
      >
        <Text style={styles.title}>Cambio email</Text>
      </Pressable>
    </View>
  )
}
~~~

- En la documentación de Zustand hay veces que define la lógica en la interfaz y otras crea un export type Actions donde define las acciones
- Uso **set** para cambiar el estado

~~~js
import { create } from "zustand"


interface ProfileState{
    name: string
    email: string
    changeProfile: (name: string, email: string)=> void
}

export const useProfileStore = create<ProfileState>()((set, get)=>({
    name: 'Bill Murray',
    email: "billybilly@gmail.com",

    changeProfile: (name: string, email: string)=>{
        set({name, email})
    }
}))
~~~

- Si necesito acceso a esa función la extraigo de useProfileStore

~~~js

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { styles } from '../../config/appTheme'
import { useProfileStore } from '../store/profile-store'

export const ProfileScreen  = () => {

  const name = useProfileStore(get=> get.name)
  const email = useProfileStore(get=> get.email)
  const changeProfile = useProfileStore(get=>get.changeProfile)

  return (
    <View style={styles.container} >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>{email}</Text>

      <Pressable style={styles.primaryButton} 
      onPress={()=>useProfileStore.setState({name: "Miguel Castaño"})}
      >
        <Text style={styles.title}>Cambio Nombre</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} 
      onPress={()=> useProfileStore.setState({email: "migue@gmail.com"})}
      >
        <Text style={styles.title}>Cambio email</Text>
      </Pressable>
      <Pressable style={styles.primaryButton} 
      onPress={()=> changeProfile("Bill Murray", "billybilly@gmail.com")}
      >
        <Text style={styles.title}>regresar estado</Text>
      </Pressable>
    </View>
  )
}
~~~

- Zustand además tiene muchos middlewares poderosos
- Creemos un counter!

~~~js
import { create } from "zustand"


interface CounterState{
    count: number
    increment: (value: number)=> void
}

export const useCounterStore = create<CounterState>()((set,get)=>({

    count: 1,
    increment: (value)=>{set(state=> ({count:state.count + value}))},
}))
~~~

- Otra manera sería

~~~js
increment: (value)=>{set({count: get().count + value})},
~~~