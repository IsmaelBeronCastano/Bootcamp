# REACT NATIVE - MAS COMPONENTES

- Creo el proyecto

> npx react-native init MasComponentes --template react-native-template-typescript

- Instalo Navigator (para el createStackNavigator) y react-native-vector-icons

> npm i @react-navigation/native
> npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

- En App debo colocar la linea de importación de react-native-gesture-handler antes que la importación de React
- Hay que colocar el NavigationContainer en la parte superior de la aplicación

~~~js
import 'react-native-gesture-handler'
import React  from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { Text } from 'react-native'

export default function App (){
    return (
      <NavigationContainer>
        <Text>Pepe</Text>
      </NavigationContainer>
    )
  
}
~~~

- Creo la carpeta src con las carpetas components, hooks y screens
- Creo el componente HomeScreen en screens
- Creo el stack y la navegación en una nueva carpeta navigator
- Para quitar los headers de las pantallas uso la opción **headerShown en false**

> npm i @react-navigation/stack

~~~js
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export const Navigator =()=> {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
    }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
~~~

- Coloco el Navigator dentro de NavigationContainer

~~~js
import 'react-native-gesture-handler'
import React  from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { Text } from 'react-native'
import { Navigator } from './src/navigator/Navigator'

export default function App (){
    return (
      <NavigationContainer>
      <Navigator />
      </NavigationContainer>
    )
}
~~~

- Para instalar los iconos (en Android)

> npm i react-native-vector-icons

- Debo configurar en android/app/build.gradle (ios tiene otra config)
- Si quisiera todos los iconos debería poner esta línea apply from: "../../node_modules/react-native-vector-icons/fonts.gradle
- Si solo quiero unos iconos en concreto debo copiar la linea anterior y este pedazo de código
- Hay que poner el nombre igual!!
  
~~~js
project.ext.vectoricons = [
  iconFontNames: ['Ionicons.ttf']
]
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
~~~

- Instalo los tipos

> npm i --save-dev @types/react-native-vector-icons

- Coloco mi primer icono en HomeScreen

~~~js
import {Text, View} from 'react-native'
import React  from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

export default function HomeScreen () {
    return (
        <View>
            <Icon 
                name={"star-outline"}
                size={50}
                color="black"
                />

        </View>
    )
  
}
~~~
----

## FlatList

- Voy a crear una lista que me sirva de menú para navegar a otras pantallas
- Necesita la **data** que renderizar, la función para renderizar el elemento (**renderItem**) y el key (**keyExtractor**)
- Se autocierra (no tiene children)
- **renderItem** **siempre devuelve un elemento JSX**
- Para la función de renderItem creo una **interfaz**, porque me interesa definir como luce un MenuItem
- Puedo **desestructurar el item y el index de renderItem**. Aquí solo desestructuro el item
- Del key de keyExtractor recibo directamente el item, **tiene que ser un string!**

~~~js
import {Text, View} from 'react-native'
import React  from 'react'
import { FlatList } from 'react-native'

interface MenuItem{
    name: string,
    icon: string,
    components: string
}

const menuItems=[
    {name: 'Animation 101', icon: 'cube-outline', components: 'Animation101Screen'},
]



export default function HomeScreen () {

    const renderMenuItem = (menuItem: MenuItem)=>{
        return (
            <View>
                <Text>{menuItem.name} - {menuItem.icon}</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
       
       <FlatList 
        data={menuItems}
        renderItem={({item})=>renderMenuItem(item)}
        keyExtractor={(item)=> item.name}
       />

        </View>
    ) 
}
~~~

- Entonces, necesito la **data**, la función de **renderItem** que debe retornar un JSX y el **keyExtractor** que debe de ser un string
- Creo una nueva carpeta llamada theme en src/
- Creo appTheme con una StyleSheet y la importo

~~~js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
      title:{
        fontSize: 35,
        fontWeight: 'bold'
      }
});
~~~

- Añado el estilo al texto "Opciones de menú"

~~~js
import {Text, View} from 'react-native'
import React  from 'react'
import { FlatList } from 'react-native'
import { styles } from '../theme/appTheme'

interface MenuItem{
    name: string,
    icon: string,
    components: string
}

const menuItems: MenuItem[]=[
    {name: 'Animation 101', icon: 'cube-outline', components: 'Animation101Screen'},
]



export default function HomeScreen () {

    const renderMenuItem = (menuItem: MenuItem)=>{
        return (
            <View>
                <Text>{menuItem.name} - {menuItem.icon}</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>

            <Text style={styles.title} >Opciones de Menú</Text>
       
       <FlatList 
        data={menuItems}
        renderItem={({item})=>renderMenuItem(item)}
        keyExtractor={(item)=> item.name}
       />

        </View>
    ) 
}
~~~

- Pero de esta manera cuando hago scroll el Texto no se va para arriba y además choca con el notch de ios
- Este texto puede ser parte del menú
- Creo una función que retorne el texto. Lo meto dentro de un View porque me ayudará con el CSS (separaciones, sombras, etc)
- Ahora puedo llamar a la función con la propiedad **ListHeaderComponent**. Necesita una función que regrese un JSX
- Incluso tengo para personalizar el estilo con **ListHeaderComponentStyle**
- Uso **useSafeAreaInsets** para desestructurar el **top** y añadirle 20 para que el header no moleste con el notch
- Le añado también un **marginBottom**
- Lo coloco en el style del View que devuelve renderListHeader

~~~js
import {Text, View} from 'react-native'
import React  from 'react'
import { FlatList } from 'react-native'
import { styles } from '../theme/appTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface MenuItem{
    name: string,
    icon: string,
    components: string
}

const menuItems: MenuItem[]=[
    {name: 'Animation 101', icon: 'cube-outline', components: 'Animation101Screen'},
]



export default function HomeScreen () {

    const {top} = useSafeAreaInsets()

    const renderMenuItem = (menuItem: MenuItem)=>{
        return (
            <View>
                <Text>{menuItem.name} - {menuItem.icon}</Text>
            </View>
        )
    }

    const renderListHeader =()=>{
        return(
            <View style={{marginTop: top+20, marginBottom: 20}}>
                <Text style={styles.title} >Opciones de Menú</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
       
       <FlatList 
        data={menuItems}
        renderItem={({item})=>renderMenuItem(item)}
        keyExtractor={(item)=> item.name}
        ListHeaderComponent={()=>renderListHeader()}
       />

        </View>
    )
}
~~~

- Tampoco quiero que todo quede pegado a los bordes, creo la propiedad globalMargin en appTheme

~~~js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  globalMargin:{
    marginHorizontal: 20
  },
      title:{
        fontSize: 35,
        fontWeight: 'bold'
      }
});
~~~

- Uso el spread de styles para usar solo globalMargin

~~~js
return (
    <View style={{flex: 1, ...styles.globalMargin}}>
    
    <FlatList 
    data={menuItems}
    renderItem={({item})=>renderMenuItem(item)}
    keyExtractor={(item)=> item.name}
    ListHeaderComponent={()=>renderListHeader()}
    />

    </View>
)
~~~

- Coloco otro icono. recuerda que los nombres deben ser diferentes para el keyExtractor

~~~js
const menuItems: MenuItem[]=[
    {name: 'Animation 101', icon: 'cube-outline', components: 'Animation101Screen'},
    {name: 'Animation 102', icon: 'albums-outline', components: 'Animation102Screen'},
]
~~~

- Para crear separación entre los componentes tengo **ItemSeparatorComponent**
- Devuelve un JSX, solo aparece entre los items ( ni al principio ni al final)

~~~js
return (
    <View style={{flex: 1, ...styles.globalMargin}}>
    
    <FlatList 
    data={menuItems}
    renderItem={({item})=>renderMenuItem(item)}
    keyExtractor={(item)=> item.name}
    ListHeaderComponent={()=>renderListHeader()}
    ItemSeparatorComponent={()=> <Text>_________________</Text>}
    />

    </View>
)
~~~

- Puedo crear una función para el ItemSeparatorComponent
- Cuando **no hay ningún argumento puedo mandar solo la declaración de la función**

~~~js
import {Text, View} from 'react-native'
import React  from 'react'
import { FlatList } from 'react-native'
import { styles } from '../theme/appTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface MenuItem{
    name: string,
    icon: string,
    components: string
}

const menuItems: MenuItem[]=[
    {name: 'Animation 101', icon: 'cube-outline', components: 'Animation101Screen'},
    {name: 'Animation 102', icon: 'albums-outline', components: 'Animation102Screen'},
]



export default function HomeScreen () {

    const {top} = useSafeAreaInsets()

    const renderMenuItem = (menuItem: MenuItem)=>{
        return (
            <View>
                <Text>{menuItem.name} - {menuItem.icon}</Text>
            </View>
        )
    }

    const renderListHeader =()=>{
        return(
            <View style={{marginTop: top+20}}>
                <Text style={styles.title} >Opciones de Menú</Text>
            </View>
        )
    }

    const itemSeparatror = ()=>{
        return(
            <View 
            style={{borderBottomWidth: 1,
                opacity: 0.4,
                marginVertical: 8
                }}
            />
        )
    }

    return (
        <View style={{flex: 1, ...styles.globalMargin}}>
       
       <FlatList 
        data={menuItems}
        renderItem={({item})=>renderMenuItem(item)}
        keyExtractor={(item)=> item.name}
        ListHeaderComponent={renderListHeader}
        ItemSeparatorComponent={itemSeparatror}
       />

        </View>
    ) 
}
~~~

- No hay ningún **FlatListItem**, hay que crearlo
- Vamos a crear un componente pra reutilizar llamado FlatListMenuItems
- Necesito la interfaz en el componente, la corto y la coloco en la carpeta src/interfaces
- La importo en HomeScreen
- Creo una interfaz **Props** en FlatListMenuItem

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { MenuItem } from '../interfaces/appInterfaces'

interface Props{
    menuItem: MenuItem
}

const FlatListMenuItem = ({menuItem}: Props) => {
    return (
        <View>
            <Text>{menuItem.name} - {menuItem.icon}</Text>
        </View>
    )
}

export default FlatListMenuItem
~~~

- En HomeScreen ya no tengo la función de **renderItem**, le paso el componente directamente

~~~js
return (
    <View style={{flex: 1, ...styles.globalMargin}}>
    
    <FlatList 
    data={menuItems}
    renderItem={({item})=><FlatListMenuItem menuItem={item} />}
    keyExtractor={(item)=> item.name}
    ListHeaderComponent={renderListHeader}
    ItemSeparatorComponent={itemSeparatror}
    />

    </View>
)
~~~

- Puedo aplicar los estilos al FlatListMenuItem de manera local
- Quiero poner el icono, el texto y una flechita para indicar que lleva a esa página
- Uso Icon de IonIcons
- Cambio la dirección de flex a row (por defecto está en column)
- Coloco una separación en el texto y aumento la fuente
- La flecha es otro icono, lo coloco en duro
- Para que se coloque al final puedo usar **otro View y colocarle flex:1**. Como está en row se estira todo lo que puede hasta el final
- **Puedo crear un spacer con un flex de 1 (se suele hacer, es lo mismo)**
- Para hacer los MenuItems clicables lo enmarcamos en un **TouchableOpacity**
~~~js
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { MenuItem } from '../interfaces/appInterfaces'
import { StyleSheet } from 'react-native'
import  Icon  from 'react-native-vector-icons/Ionicons'

interface Props{
    menuItem: MenuItem
}

const FlatListMenuItem = ({menuItem}: Props) => {
    return (
        <TouchableOpacity>
        <View style={styles.container} >
            <Icon
            name={menuItem.icon}
            color="gray"
            size={23}
            />
            <Text style={styles.itemText}>
                {menuItem.name}
                </Text>
            
            <View style={{flex:1}} />
            <Icon
            name="chevron-forward-outline"
            color="gray"
            size={23}
            />
            
           
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
      container:{
        flexDirection: 'row'
      },
      itemText:{
        marginLeft: 10,
        fontSize: 19
      }
});

export default FlatListMenuItem
~~~
----

## Animated API

- Animaciones!
- Creo los componentes para Animacion101 y Animacion102 en /screens

~~~js
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Animacion101Screen = () => {
  return (
   <View style={{flex:1}} >
    <View style={styles.purpleBox}   />
   </View>
  )
}

const styles = StyleSheet.create({
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animacion101Screen
~~~

- Creo una copia de este componente y lo llamo Animation102Screen
- Debo indicarle en la navegación estos dos componentes

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Animation101Screen from '../screens/Animation101Screen';
import Animation102Screen from '../screens/Animation102Screen';

const Stack = createStackNavigator();

export const Navigator =()=> {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
    }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Animation101Screen" component={Animation101Screen} />
      <Stack.Screen name="Animation102Screen" component={Animation102Screen} />
    </Stack.Navigator>
  );
}
~~~

- En FlatListMenuItem uso useNavigation para obtener el navigation
- **NOTA**: Hay que hacer un poco de ingenieria para tipar el menuItem.component para hacer el componente reutilizable
- Primero creas un tipo para las rutas

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Animation101Screen from '../screens/Animation101Screen';
import Animation102Screen from '../screens/Animation102Screen';

export type RootStackParamList = {
  HomeScreen: undefined
  Animation101Screen: undefined
  Animation102Screen: undefined
}

const Stack = createStackNavigator<RootStackParamList>();


export const Navigator =()=> {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
    }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Animation101Screen" component={Animation101Screen} />
      <Stack.Screen name="Animation102Screen" component={Animation102Screen} />
    </Stack.Navigator>
  );
}
~~~

- Hay que crear un nuevo tipo para el hook de navigation importando **StackNavigationProp**

~~~js
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { MenuItem } from '../interfaces/appInterfaces'
import { StyleSheet } from 'react-native'
import  Icon  from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigator/Navigator'

interface Props{
    menuItem: MenuItem
}

type navigationPropList = StackNavigationProp<RootStackParamList>


const FlatListMenuItem = ({menuItem}: Props) => {

    const navigation = useNavigation<navigationPropList>()

    return (
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate(menuItem.component)}
        >
        <View style={styles.container} >
            <Icon
            name={menuItem.icon}
            color="gray"
            size={23}
            />
            <Text style={styles.itemText}>
                {menuItem.name}
                </Text>
            
            <View style={{flex:1}} />
            <Icon
            name="chevron-forward-outline"
            color="gray"
            size={23}
            />
            
           
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
      container:{
        flexDirection: 'row'
      },
      itemText:{
        marginLeft: 10,
        fontSize: 19
      }
});

export default FlatListMenuItem
~~~

- Por último para que no de error cambio la interfaz de MenuItem

~~~js
import { RootStackParamList } from "../navigator/Navigator";

export interface MenuItem{
    name: string,
    icon: string,
    component: keyof RootStackParamList
}
~~~

- Con poner **as never** en menuItem.component también se resolvía
- **Otra opción es**

~~~js
<TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.dispatch(CommonActions.navigate({name: menuItem.component}))}
        >
~~~

- **SIGAMOS!**
- Quiero que la caja aparezca con un fade, caiga y rebote en su punto final
- Tengo que centrar la caja, lo hago con styles.container
- Para la animación usaremos **useRef** con **Animated**
  - Value es para un solo valor ValueXY para dos valores.
  - El .current es del useRef
- En lugar de un View, para usar la animación debo usar **Animated.View**

~~~js
import React, { useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'

const Animation101Screen = () => {

  const opacity = useRef(new Animated.Value(0.4)).current


  return (
   <View style={styles.container} >
    <Animated.View style={{...styles.purpleBox, opacity: opacity}}   />
   </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animation101Screen
~~~
-------

## Fade In Fade Out

- **Animated.timing** es para animar algo en el tiempo. 
- Necesita algo de tipo **Animated.Value**, como es la opacidad que creé, y un objeto de configuración
- Me pide el **toValue**, **duration** y **UseNativeDriver**
- Para que la animación empiece tengo que ponerle el **.start()**
- Creo un Button para llamar al fadeIn

~~~js
import React, { useRef } from 'react'
import { StyleSheet, View, Animated, Button } from 'react-native'

const Animation101Screen = () => {

  const opacity = useRef(new Animated.Value(0)).current   //uso .current porque me interesa trabajar con el valor

  const fadeIn = ()=>{
    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 900,
        useNativeDriver: true //activa la aceleración por hardware
      }
    ).start()
  }
  const fadeOut = ()=>{
    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 900,
        useNativeDriver: true //activa la aceleración por hardware
      }
    ).start()
  }


  return (
   <View style={styles.container} >
    <Animated.View style={{...styles.purpleBox, opacity: opacity, marginBottom: 20}}   />
    <Button 
      title="FadeIn"
      onPress={ fadeIn}
    ></Button>
    <Button 
      title="FadeOut"
      onPress={ fadeOut}
    ></Button>
   </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animation101Screen
~~~

- .start puede recibir un callback opcional que se dispará cuando la animación termine
- Puede usarse para resetear la animación
-----

## Easing Bounce

- Quiero que cuando haga el Fade in el componente caiga de arriba y que rebote
- Creo una nueva propiedad top. Le coloco -100 (como si hablara del top: -100) para que se sitúe arriba
- Colocarlo en la propiedad CSS top **no me sirve, tengo que usar el transform e indicarle las coordenadas**
- Para que rebote, puedo usar la animación de top usando **la propiedad easing con Easing de react-native**

~~~js
import React, { useRef } from 'react'
import { StyleSheet, View, Animated, Button, Easing } from 'react-native'

const Animation101Screen = () => {

  const opacity = useRef(new Animated.Value(0)).current
  const top = useRef(new Animated.Value(-100)).current

  const fadeIn = ()=>{
    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 900,
        useNativeDriver: true //activa la aceleración por hardware
      }
    ).start()

    Animated.timing(
      top,
      {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.bounce
      }
    ).start()
  }

  const fadeOut = ()=>{
    Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 900,
        useNativeDriver: true //activa la aceleración por hardware
      }
    ).start()
  }


  return (
   <View style={styles.container} >
    <Animated.View style={{...styles.purpleBox, 
      opacity: opacity, 
      marginBottom: 20,
      transform: [
        {
          translateY: top
        }
      ]}}   />
    <Button 
      title="FadeIn"
      onPress={ fadeIn}
    ></Button>
    <Button 
      title="FadeOut"
      onPress={ fadeOut}
    ></Button>
   </View>
  )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
      purpleBox:{
        backgroundColor: '#5856D6',
        width: 150,
        height: 150
      }
});
export default Animation101Screen
~~~
----

## useAnimation

- Copio y pego el código de las animaciones para hacer un custom hook
- Retorno los valores y la función

~~~js
import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

const useAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current
    const top = useRef(new Animated.Value(-100)).current
  
    const fadeIn = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
  
      Animated.timing(
        top,
        {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.bounce
        }
      ).start()
    }
  
    const fadeOut = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
    }
  
  
    return {
        opacity,
        top,
        fadeIn,
        fadeOut
    }
}

export default useAnimation
~~~

- Ahora ya puedo usar el custom hook en Animation101Screen

~~~js
const {fadeIn, fadeOut, opacity, top}= useAnimation()
~~~

- Refactorización! Cambio el nombre de la propiedad top por position
- Creo una función que me permita jugar con la posición

~~~js
import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

const useAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current
    const position = useRef(new Animated.Value(-100)).current
  
    const fadeIn = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
    }
  

  
    const fadeOut = ()=>{
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 900,
          useNativeDriver: true //activa la aceleración por hardware
        }
      ).start()
    }
  
    const startMovingPosition =(initPosition: number= -100, duration: number=600 )=>{
        position.setValue(initPosition)

        Animated.timing(
            position,
            {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
              easing: Easing.bounce
            }
          ).start()
        }
    
  
    return {
        opacity,
        position,
        fadeIn,
        fadeOut,
        startMovingPosition
        
    }
}

export default useAnimation
~~~

- Coloco la nueva función en el onPress

~~~js
<Button 
      title="FadeIn"
      onPress={ ()=>{
        fadeIn(), 
        startMovingPosition() }}
    ></Button>
~~~

- Esta librería da mucho juego. **Puedes animar cualquier propiedad que sea soportada por Animated.View** (no todas!!) 
----

## Animated ValueXY

- Trabajemos con ValueXY en la animación 102
- Copio el ejemplo de la página reactnative.dev en components/DraggableView.tsx

~~~js
import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
      ).start();
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.box]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#61dafb',
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default DraggableView;
~~~

- Tengo un WARNING, me dice que requiere un segundo argumento
- Cambiando **useNativeDriver a false** deja de rebentar pero sigue el warning
- Me pide un segundo argumento, le paso el useNativeDriver

~~~js
import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
    [
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
      
    ],
    {useNativeDriver: false} //le paso esto como segundo argumento para eliminar el WARNING
    ),
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: false}, // Back to zero
      ).start();
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.box]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#61dafb',
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default DraggableView;
~~~
-----

## Componente Switch

- Copio el ejemplo

~~~js
import React, {useState} from 'react';
import {View, Switch, StyleSheet} from 'react-native';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); //obtengo el estado anterior y lo cambio al booleano opuesto

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
~~~

- Creo un nuevo Screen para este componente

~~~js
import React from 'react'
import { View } from 'react-native-reanimated/lib/typescript/Animated'

const SwitchScreen = () => {
  return (
    <View style={{marginTop: 100}}>

    </View>
  )
}

export default SwitchScreen
~~~

- Tengo que poder llegar a la pantalla, vamos al navigator
- Debo añadir el componente a RootStackParamList (configuración que se hizo para tipar el navigator y no diera error con menuItem) 
- **NOTA**: se podía evitar esta "sobreingeniería" **tipando menuItem.component as never**

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Animation101Screen from '../screens/Animation101Screen';
import Animation102Screen from '../screens/Animation102Screen';
import SwitchScreen from '../screens/SwitchScreen';

export type RootStackParamList = {
  HomeScreen: undefined
  Animation101Screen: undefined
  Animation102Screen: undefined
  SwitchScreen: undefined
}

const Stack = createStackNavigator<RootStackParamList>();


export const Navigator =()=> {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
    }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Animation101Screen" component={Animation101Screen} />
      <Stack.Screen name="Animation102Screen" component={Animation102Screen} />
      <Stack.Screen name="SwitchScreen" component={SwitchScreen} />
    </Stack.Navigator>
  );
}
~~~

- En el HomeScreen el menuItems está creciendo, vamos a moverlo a otro directorio llamado data o menu

~~~js
import { MenuItem } from "../interfaces/appInterfaces";


export const menuItems: MenuItem[]=[
    {name: 'Animation 101', icon: 'cube-outline', component: 'Animation101Screen'},
    {name: 'Animation 102', icon: 'albums-outline', component: 'Animation102Screen'},
    {name: 'Switches', icon: 'toggle-outline', component: 'SwitchScreen'},

]
~~~

- **Importo menuItems en HomeScreen**
- Coloco el componente SwitchComponent que he copiado de la documentación en SwitchScreen

~~~js
import React from 'react'
import { View } from 'react-native'
import SwitchComponent from '../components/SwitchComponent'
const SwitchScreen = () => {
  return (
    <View style={{marginTop: 100}}>
      <SwitchComponent />
    </View>
  )
}

export default SwitchScreen
~~~

- Luego vamos a usar el switch en un caso real pero primero quiero hacer un header reutilizable que diga SWITCHES
------

## Header reutilizable

- Creo el componente HeaderTitle.tsx
- Importo el styles de appTheme y extraigo el top del SafeAreaInsets

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../theme/appTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const HeaderTitle = () => {
    const {top} = useSafeAreaInsets()
  return (
    <View style={{marginTop: top+20}}>
    <Text style={styles.title} >Opciones de Menú</Text>
    </View>
  )
}

export default HeaderTitle
~~~

- Coloco el componente en el header del FlatList en HomeScreen

~~~js
    return (
        <View style={{flex: 1, ...styles.globalMargin}}>
       
       <FlatList 
        data={menuItems}
        renderItem={({item})=><FlatListMenuItem menuItem={item} />}
        keyExtractor={(item)=> item.name}
        ListHeaderComponent={HeaderTitle} //aquí
        ItemSeparatorComponent={itemSeparator}
       />

        </View>
    )
~~~

- Ahora falta definir las props que quiero customizar. Básicamente el título
- Creo la interfaz de las props 

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../theme/appTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props{
    title: string
}

const HeaderTitle = ({title}: Props) => {
    const {top} = useSafeAreaInsets()
  return (
    <View style={{marginTop: top+20}}>
    <Text style={styles.title} >{title}</Text>
    </View>
  )
}

export default HeaderTitle
~~~

- Ahora puedo usar el componente y pasarle un título

~~~js
<FlatList 
  data={menuItems}
  renderItem={({item})=><FlatListMenuItem menuItem={item} />}
  keyExtractor={(item)=> item.name}
  ListHeaderComponent={()=> <HeaderTitle title="Opciones de Menú" />}
  ItemSeparatorComponent={itemSeparator}
  />
~~~

- Puedo usarlo en SwitchScreen también

~~~js
import React from 'react'
import { View } from 'react-native'
import SwitchComponent from '../components/SwitchComponent'
import HeaderTitle from '../components/HeaderTitle'
const SwitchScreen = () => {
  return (
    <View style={{marginHorizontal: 20}}>
      <HeaderTitle title="Switches" />
      <SwitchComponent />
    </View>
  )
}

export default SwitchScreen
~~~

- Vamos a trabajar con la reutilización del switch
-------

## CustomSwitch

- Necesito una función que me indique cuando cambia el switch
- 