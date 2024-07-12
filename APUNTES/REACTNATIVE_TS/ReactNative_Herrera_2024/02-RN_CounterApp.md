## 02 REACT NATIVE - COUNTER APP

- Usaremos Material 3
- Cambio la declaración de function App por una función de flecha y lo exporto en lugar de usar la exportación por defecto

~~~js
import React from 'react';
import { Text, View } from 'react-native';


export const App= (): React.JSX.Element=> {

  return(
    <View>
      <Text>Hola Mundo</Text>
    </View>
   )
 
}
~~~

- Debo cambiar también la importación de App en index.js y colocarlo entre llaves

~~~js
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
~~~
-----

## Explicación de archivos y directorios

- .watchmanconfig (no se suele necesitar modificarlo)
- app.json es info básica de la app, es usado en otros directorios, pone la info en ios y android
- babel.config.js permite escribir javascript moderno
- Gemfile es el archivo de configuración de Ruby
- index.js es el main, el archivo de inicio. Cuando se lance todo la app empezará por aquí
- metro.config.js es raro que se tenga que modificar
- En las carpetas android o ios tengo la aplicación en si 
-----

## Crear pantallas independientes

- En lugar del View uso el SafeAreaView para que se renderice correctamente con el notch de ios
- En src/**presentation**/**screens** creo el HelloWorldScreen.tsx y lo renderizo en App.tsx

~~~js
import React from 'react';
import { SafeAreaView, Text} from 'react-native';
import HelloWorldScreen from './src/presentation/HelloWorldScreen';


export const App= (): React.JSX.Element=> {

  return(
    <SafeAreaView>
      <HelloWorldScreen />
    </SafeAreaView>
   )
}
~~~

- Para los estilos creo el snippet con la extensión Easy Snippets, uso **stless**

~~~js
// @prefix stless
// @description 
/* eslint-disable */


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})
~~~

- Para agregar estilos solo tengo que usar la propiedad style y añadir con notación de punto los estilos
- Si el flex: 1 no funciona, mirar que el componente padre (como es en este caso el SafeAreaView en App no lo esté restringiendo)

~~~js
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const HelloWorldScreen = () => {
  return (
    <View style={styles.container} >
        <Text style={styles.title}>Hello World</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }, 

  title:{
    fontSize: 45,
    textAlign: 'center',
    color: 'black'
  }
})

export default HelloWorldScreen
~~~
--------

## Propiedades

- Para usar propiedades en los componentes en Typescript hay que usar una interfaz
- Puedo hacer la propiedad opcional con ?
- La desestructuro y añado el tipado de la interfaz
- Puedo ponerle un valor por defecto

~~~js
interface Props{
  name?: string
}

const HelloWorldScreen = ({name= "World"}: Props) => {
  return (
    <View style={styles.container} >
        <Text style={styles.title}>Hello {name}</Text>
    </View>
  )
}
~~~

- Ahora puedo pasarle la propiedad name al componente

~~~js
export const App= (): React.JSX.Element=> {

  return(
    <SafeAreaView>
      <HelloWorldScreen name='Ismael Berón' />
    </SafeAreaView>
   )
}
~~~

- Los componentes nativos tienen sus propias propiedades
- Por ejemplo, Text tiene **numberOfLines** que son el número de lineas que quiero y si no cabe corta el texto con una elipsis (...)
  - Puedo controlar esta elipsis con **ellipsizeMode**, 
  - **tail** es por defecto, quita el texto al final, **middle** hace el corte en medio, **head** lo quita del principio, **clip**lo acomoda como puede 
----

## Crear un contador

- Creo el componente CounterScreen en **src/presentation/screens** con un View y un Text
  - Usar el snippet personalizado **rncc** hecho con *Easy Snippets*

~~~js
// @prefix rncc
// @description 
/* eslint-disable */


import React from 'react'
import { Text, View } from 'react-native'

export const CounterScreen = () => {
  return (
    <View>
        <Text></Text>
    </View>
  )
}
~~~

- Añado unos estilos y coloco unos botones. Usaremos Button para este caso pero no es el que usaremos normalmente
- Contador

~~~js
export const CounterScreen = () => {

  const [counter, setCounter] = useState(10)


  const increment = ()=> {
    setCounter(counter +1)
  }

  const decrement = ()=> {
    setCounter(counter -1)
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Counter: {counter} </Text>

        <Button title="increment" onPress={()=>increment()}/>
        <Button title="decrement" onPress={()=> decrement()}/>
    </View>
  )
}
~~~

- Puedo usar el Pressable que es más personalizable.
- Aparecen sin estilos. Creo button en styles, y buttonText para el texto del botón
- Puedo usar la prop onLongPress para resetear el contador usando el setCounter

~~~js
import React, { useState } from 'react'
import { Button, Pressable, StyleSheet, Text, View} from 'react-native'

export const CounterScreen = () => {

  const [counter, setCounter] = useState(10)


  const increment = ()=> {
    setCounter(counter +1)
  }

  const decrement = ()=> {
    setCounter(counter -1)
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Counter: {counter}</Text>

        <Pressable style={styles.button} onPress={increment}>
          <Text style={styles.buttonText}>Increment</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={decrement} onLongPress={()=>setCounter(0)}>
          <Text style={styles.buttonText}>Decrement</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize: 45,
    color:'black',
    fontWeight: '300'
  },
  button:{
    backgroundColor: 'purple',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonText:{
    fontSize: 25,
    color: 'white'
  }
})
~~~

- Para que aparezca el color picker habilitar Editor:color decorators en VSCode
- Puedo usar en el style de Pressable un callback del que puedo desestructurar **pressed**, devuelve un arreglo.
- Le paso los estilos del botón y puedo usar pressed (boolean por defecto en true) para aplicar estilos condicionalmente cuando se apriete el botón

~~~js
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Counter: {counter}</Text>

        <Pressable 
        style={({pressed})=>[
            styles.button,
            pressed && styles.buttonPressed]} 
            onPress={increment}>
             <Text style={styles.buttonText}>Increment</Text>
        </Pressable>
        <Pressable 
        style={({pressed})=>[
            styles.button,
            pressed && styles.buttonPressed]} 
            onPress={decrement} onLongPress={()=>setCounter(0)}>
          <Text style={styles.buttonText}>Decrement</Text>
        </Pressable>
    </View>
  )
~~~

- Es más práctico crear un componente para tener personalizado el botón, que sea customizable
- Para renderizar estilos condicionalmente si estamos en android o ios uso **Platform** de 'react-native'
- Ejemplo:

~~~js
 buttonPressed:{
    backgroundColor: Platform.OS === 'android'? 'rgb(126, 0, 78)': 'white'
  }
~~~

- De esta manera tengo el estilo aplicado de manera independiente por plataforma
------

## Componente Personalizad

- Conviene tener una biblioteca de componentes personalizados (y personalizables) para no estar reinventando la rueda
- Creemos este botón en /components/**shared** con un archivo de barril **index.ts**
- Dentro de share creo PrimaryButton.tsx con el snippet **rafc** o el snippet personalizado **rncc**
- Lo coloco en el archivo de barril

~~~js
export * from './PrimaryButton'
~~~

- Creo la interfaz para las props, hago el longPress opcional
- Coloco las props donde corresponden
- Copio los estilos que había definido y se los coloco al componente

~~~js
import React from 'react'
import { GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

interface Props{
  label: string
  onPress: (event: GestureResponderEvent)=> void
  onLongPress?: (event: GestureResponderEvent)=> void
}

export const PrimaryButton = ({label, onPress, onLongPress}: Props) => {
  return (
    <View>
        <Pressable style={({pressed})=>[
          styles.button,
          pressed && styles.buttonPressed
        ]} onPress={onPress} onLongPress={onLongPress} >
          <Text style={styles.buttonText} >{label}</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  button:{
    backgroundColor: 'purple',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonText:{
    fontSize: 25,
    color: 'white'
  },
  buttonPressed:{
    backgroundColor: Platform.OS === 'android' ?'rgb(126, 0, 78)': 'white'
  }

})
~~~
----

- Añado el componente a CounterScreen

~~~js
export const CounterScreen = () => {

  const [counter, setCounter] = useState(10)


  const increment = ()=> {
    setCounter(counter +1)
  }

  const decrement = ()=> {
    setCounter(counter -1)
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Counter: {counter}</Text>
      <PrimaryButton label="increment" onPress={increment} onLongPress={()=>setCounter(0)} />
      <PrimaryButton label="decrement" onPress={decrement} />
    </View>
  )
}
~~~
-----

## React Native Paper - Instalación

- Instalamos

> npm i react-native-paper
> npm i react-native-safe-area-context

- Hay que usar el PaperProvider como provider en el punto más alto de la aplicación que va a contener los componentes

~~~js
import React from 'react';
import { CounterScreen } from './src/presentation/screens/CounterScreen';
import {PaperProvider} from 'react-native-paper'

export const App=(): React.JSX.Element=>{

  return(
      <PaperProvider>
         <CounterScreen />
      </PaperProvider>
   )
}
~~~

- Si tienes un gestor de estado tipo Redux-toolkit, colocar el PaperProvider dentro del gestor de estado y dentro del PaperProvider el App
- React Native Paper se puede **customizar**
- Puedo mirar la documentación para evr cómo usar un Button de React Native Paper
- Uso el mode contained 
- Los componentes de React Native Paper siguen los standares de React Native

~~~js
import React, { useState } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { PrimaryButton } from '../../components/shared'
import {Button} from 'react-native-paper'

export const CounterScreen = () => {

  const [counter, setCounter] = useState(10)


  const increment = ()=> {
    setCounter(counter +1)
  }

  const decrement = ()=> {
    setCounter(counter -1)
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Counter: {counter}</Text>
      <PrimaryButton label="increment" onPress={increment} onLongPress={()=>setCounter(0)} />
      <Button onPress={decrement} mode='contained'>Decrementar</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize: 45,
    color:'black',
    fontWeight: '300'
  }
})
~~~
----

## Floating Action Button FAB

- Para crear estilos de manera global, creo una carpeta en presentation/**theme**

~~~js
import { StyleSheet } from "react-native"

export const Globalstyles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: '300',
        color: 'black'
    }
})
~~~

- Ahora solo debo importarlo y usar GlobalStyles.centerContainer
- Para crear un FAB creo un nuevo componente en /**shared**, lo exporto en el archivo de barril
- Mirar la documentación de **React Native Paper**!!

~~~js
import React from 'react'
import { StyleSheet } from 'react-native'
import {FAB} from 'react-native-paper'

export const FloatingAB = () => {
  return (
    <FAB 
    style={styles.fab} 
    onPress={()=>console.log("FAB!")}
    label="FAB"
    />
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS === 'android'? 15: 0
  }
})
~~~

- Puedo también usar GlobalStyles para los estilos del fab
-------

## Configurar iconos

> npm i react-native-vector-icons
> npm i -D @types/react-native-vector-icons

- En *android/app/build.gradle* añadir

~~~js
project.ext.vectoricons =[
  iconFontNames: ['Ionicons.ttf']
]

apply from: file ("../../node_modules/react-native-vector-icons/fonts.gradle")
~~~

- Ahora ya puedo usar iconos. Importo Icon de 'react-native-vector-icons/Ionicons'

~~~js
<Icon name="accessibility-outline" size={35} />
~~~

- Icon tiene un montón de propiedades
- En el FAB puedo colocar el icon de varias maneras, incluso puedo mandar un funtional Component
- Pero quiero hacerlo de otra forma
- Hay que configurar Paper
-------

## Configurar Iconos Globles

- En **PaperProvider** uso la propiedad **settings**

~~~js
import React from 'react';
import { CounterScreen } from './src/presentation/screens/CounterScreen';
import {PaperProvider} from 'react-native-paper'
import IonIcon from 'react-native-vector-icons/Ionicons'

export const App=(): React.JSX.Element=>{

  return(
      <PaperProvider
      settings={({
         icon: (props)=> <IonIcon {...props} />
      })}
      >
         <CounterScreen />
      </PaperProvider>
   )
}
~~~

- Ahora solo tengo que añadir el icono que quiero a la propiedad icon. Ya no necesita el label

~~~js
export const FloatingAB = () => {
  return (
    <FAB 
    style={styles.fab} 
    onPress={()=>console.log("FAB!")}
    icon='add'
    />
  )
}
~~~
------





