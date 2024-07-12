# REACT NATIVE - NAVEGACION

## Tipos de Navegación

- Usaremos el paquete React Navigation
- Tenemos:
    - **Stack Navigation**: las pantallas se apilan como en una baraja de cartas
    - **Drawer Navigation**: abre un menú lateral
    - **BottomTab Navigation**: tienes las opciones en el bottom
    - **MaterialTop Navigation**: tienes las opciones en el top
- Se pueden combinar. Tiene su ciencia! 
- Con navigation.navigate navegamos entre las pantallas
- En Stack Navigation podemos deshacernos de las pantallas con **navigation.pop**, con **popToTop** volvemos a la primera, con **goBack** a la anterior
----

## Instalaciones

- Creo los directorios en src
    - **presentation**: la capa de presentacion, lo que está cerca del usuario. Componentes, visualización y demás
        - Dentro de presentation creo **screens** para las pantallas, **theme** para los estilos globales con theme.ts, **routes** para las rutas y **components**
    - Dentro de screens creo una carpeta **home** con la **HomeScreen.tsx**
    - Creo otras dos carpetas dentro de screens llamada products con ProductScreen.tsx y ProductsScreen.tsx y tabs con Tab1Screen, 2 y 3
    - Creo también la carpeta about dentro de screens con la AboutScreen.tsx
    - Creo otra carpeta dentro de screens llamada profiles con ProfileScreen.tsx y settings con SettingsScreen.tsx

> npm i @react-navigation/native
> npm install react-native-gesture-handler
> npm i react-native-screens  react-native-safe-area-context
> npm i @react-native-community/masked-view

- Usa import 'react-native-gesture-handler' en App.tsx **encima de todos los import**
- Lanza la app para ver si hay algún error
- Si da error con la ruta HOME de JAVA colocar la ruta en gradle.properties

~~~
org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
~~~

- Si da error  de React.jsx: type is invalid, cambiar App por una función de flecha, no exportarlo por default y cambiar la exportación en index.js

~~~js
import 'react-native-gesture-handler';
import React from 'react';
import { Text, View } from 'react-native';


export const App=(): React.JSX.Element=> {


  return (
    <View>
      <Text>Hello world</Text>
    </View>
  );
}
~~~

- index.js
~~~js
import {AppRegistry} from 'react-native';
import {App} from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
~~~

## React Navigation Stack

- Instalación

> npm i @react-navigation/stack
> npm install @react-native-masked-view/masked-view

- En presentation/routes creo el archivo stackNavigator.tsx
- Creo una navegación con el ejemplo de la documentación y le añado mis componentes

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator();

export const StackNavigator =()=> {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
~~~

- Coloco el stackNavigator en App dentro de NavigationContainer

~~~js
import 'react-native-gesture-handler';
import React from 'react';
import { StackNavigator } from './src/presentation/routes/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';


export const App=(): React.JSX.Element=> {

  return (
    <NavigationContainer>
        <StackNavigator />
    </NavigationContainer>
  );
}
~~~
-----

## Navegar a otras pantallas

- Si hago un console.log de las props de HomeScreen hay muchas debido a que estoy dentro del NavigationContainer

~~~js
import React from 'react'
import { Text, View } from 'react-native'

export const HomeScreen = (props: any) => {
  console.log(props)
  
  return (
    <View>
        <Text>HomeScreen</Text>
    </View>
  )
}
~~~

- Tengo el **navigation**, **navigate**, el **pop** para cerrar la pantalla actual y regresar a la otra
- Tipar estas props puede ser un poco retador. Tenemos **hooks** que nos permiten **acceder a esa info**
- Creo un botón que me llevará a productos
- Le añado unos estilos desde los estilos globales

~~~js
import {StyleSheet} from 'react-native'

export const globalStyles = StyleSheet.create({
  container:{
    flex:1,
    padding: 20,
    justifyContent: 'center'
  },

  primaryButton:{
    backgroundColor: 'orange',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center'
  },

  buttonText:{
    color: 'black',
    fontSize: 18
  }
})
~~~

- Luego crearemos este botón personalizado
- Hagamos la navegación. Sale más fácil hacerlo con el hook **useNavigation**
- Tipo **as never** el componente al que navego, luego lo arreglaremos 

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { useNavigation } from '@react-navigation/native'

export const HomeScreen = () => {
  
  const navigation = useNavigation()
  
  return (
    <View style={globalStyles.container} >
        <Pressable 
        onPress={()=> navigation.navigate("Products" as never)}
        style={globalStyles.primaryButton} >
            <Text style={globalStyles.buttonText} >Productos</Text>
        </Pressable>
    </View>
  )
}
~~~

- Podemos personalizar el Home que se ve arriba de la pantalla, más adelante
- Creo el componente del botón personalizado
- Dentro de components creo la carpeta /**shared** y dentro PrimaryButton.tsx

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'


interface Props{
    onPress: ()=> void
    label: string
}

export const PrimaryButton  = ({label, onPress}: Props) => {


  return (
    <Pressable 
    onPress={onPress}
    style={globalStyles.primaryButton} >
        <Text style={globalStyles.buttonText}>{label}</Text>
    </Pressable>
  )
}
~~~

- En HomeScreen añado el componente y creo otro para Settings

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton } from '../../components/shared/PrimaryButton'

export const HomeScreen = () => {
  
  const navigation = useNavigation()
  
  return (
    <View style={globalStyles.container} >
      <PrimaryButton label={"Products"} onPress={()=> navigation.navigate("Products" as never)} />
      <PrimaryButton label={"Settings"} onPress={()=> navigation.navigate("Settings" as never)} />
    </View>
  )
}
~~~
------

## Estilizando Stack Navigator

- Configuraciones que podemos hacer al Stack Navigator
- Con screenOptions tienes un montón de propiedades

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { ProductScreen } from '../screens/products/ProductScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createStackNavigator();

export const StackNavigator=()=> {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,  //false no muestra el header
      headerStyle:{
        elevation: 0, //0 elimina la linea divisoria del header
        shadowColor: 'transparent', //hace que desaparezca en ios
        
      }
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
~~~

- Stack.Screen también tiene la propiedad **options**
-----

## FlatList - Pantalla de productos

- En data le añado el arreglo, en renderItem puedo desestructurar el item para acceder al objeto
- Si extraigo la data (en lugar de desestructurar item) puedo acceder a los separators (mirar documentación)
- Puedo renderizar en cada botón el name del arreglo
- Notar que el callback de renderItem está entre paréntesis y no llaves para hacer **implícito el return**
- Coloco un texto Ajustes en el bottom y otro botón

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { globalStyles } from '../../theme/theme'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { useNavigation } from '@react-navigation/native'

const products=[
  {id:1, name: "Spaceship"},
  {id:2, name: "Car"},
  {id:3, name: "Plane"},
  {id:4, name: "MotorCycle"},
  {id:5, name: "Bike"},
]

export const ProductsScreen = () => {

  const navigation = useNavigation()
  return (
    <View style={globalStyles.container}>
      <Text>Productos</Text>
        <FlatList  
        data={products}
        renderItem={({item})=>(
        <PrimaryButton
          label={item.name}
          onPress={()=>{navigation.navigate("Product" as never) } } />)} 
        />

        <Text style={{marginBottom: 10, fontSize:30}}>Ajustes</Text>
        <PrimaryButton label={"Ajustes"} onPress={()=>navigation.navigate("Settings" as never)} />
    </View>
  )
}
~~~
----

## Enviar argumentos entre pantallas

- Con el **navigation.navigate**, los argumentos que siguen al componente son los que le va a mandar a esa pantalla
- Los argumentos hay que tiparlos previamente

~~~js
onPress= {()=> {navigation.navigate("Product" as never, {id: item.id ,name: item.name})}}
~~~

- Para evitar el **as never** en el tipado me creo un tipo **RootStackParams** en el Navigator
- Le paso el RootStackParams al **createStackNavigator**

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProductScreen } from '../screens/products/ProductScreen';


export type RootstackParams ={
  Home: undefined,
  Product: {id: number, name: string},
  Products: undefined,
  Settings:undefined,
}
const Stack = createStackNavigator<RootstackParams>();

export const StackNavigator=()=> {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,  //false no muestra el header
      headerStyle:{
        elevation: 0, //0 elimina la linea divisoria del header
        shadowColor: 'transparent', //hace que desaparezca en ios

      }
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
~~~

- En ProductsScreen tengo que decirle al useNavigation **cuáles son las properties disponibles**
- Para eso **le paso el genérico NavigationProp y a este el RootStackParams**
- Puedo **quitar el as never**
- Le puedo poner type en la importación cuando es un tipo, ayuda a la transpilación ya que no se convierte en código real

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { globalStyles } from '../../theme/theme'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { type RootstackParams } from '../../routes/StackNavigator'

const products=[
  {id:1, name: "Spaceship"},
  {id:2, name: "Car"},
  {id:3, name: "Plane"},
  {id:4, name: "MotorCycle"},
  {id:5, name: "Bike"},
]

export const ProductsScreen = () => {

  const navigation = useNavigation<NavigationProp<RootstackParams>>() //aqui!

  return (
    <View style={globalStyles.container}>
      <Text>Productos</Text>
        <FlatList  
        data={products}
        renderItem={({item})=>(
        <PrimaryButton
          label={item.name}
          onPress={()=>{navigation.navigate("Product", {id: item.id, name: item.name}) } } />)} 
        />

        <Text style={{marginBottom: 10, fontSize:30}}>Ajustes</Text>
        <PrimaryButton label={"Ajustes"} onPress={()=>navigation.navigate("Settings")} />
    </View>
  )
}
~~~

- También podemos quitar el as never en Home haciendo el mismo proceso

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import type {RootstackParams } from '../../routes/StackNavigator'

export const HomeScreen = () => {
  
  const navigation = useNavigation<NavigationProp<RootstackParams>>()
  
  return (
    <View style={globalStyles.container} >
      <PrimaryButton label={"Products"} onPress={()=> navigation.navigate("Products")} />
      <PrimaryButton label={"Settings"} onPress={()=> navigation.navigate("Settings")} />
    </View>
  )
}
~~~

- **Cómo obtenemos los argumentos que pasamos entre pantallas?**
- Vienen en las **props.params**, pero puede ser que estés en una situación en la cual no puedas extraerlo de las props
- Para ello usaremos **useRoute**
- Para tiparlo uso como genérico el RouteProp, y dentro cómo genérico le paso el RootstackParams, del componente Product
- Sin el tipado quedaría useRoute().params
- Con el tipado ya puedo desestructurar el id y el name y pasarselo al Text
- Para colocar el nombre del producto en el header usaré un **useEffect**
- Accedo al header a través del **useNavigation** con el método **setOptions y la propiedad title**

~~~js
import { type RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { type RootstackParams } from '../../routes/StackNavigator'
import { globalStyles } from '../../theme/theme'

export const ProductScreen = () => {

  const {id, name} = useRoute<RouteProp<RootstackParams, 'Product'>>().params //los argumentos estan en .params
  const navigation = useNavigation()

  useEffect(()=>{
    navigation.setOptions({
      title: name
    })
  },[])

  return (
    <View style={globalStyles.container} >
        <Text style={{fontSize: 20, textAlign: 'center', marginTop: 20}}>{id} - {name} </Text>
    </View>
  )
}
~~~
-----

## Stack PopToPop

- Para volver al Home ya no tenemos el popToTop directamente del navigator. Tenemos que usar el dispatch
- Tenemos ciertas acciones específicas que estan en el StackActions. Así nos ahorramos tipar el useNavigation
- También puedo usar el .goBack() para volver atrás

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { StackActions, useNavigation } from '@react-navigation/native'

export const SettingsScreen = () => {

  const navigator = useNavigation()

  return (
    <View style={globalStyles.container} >
        <Text style={{marginBottom: 10}} >SettingsScreen</Text>

        <PrimaryButton 
        label="Regresar"
        onPress={()=>navigator.goBack()} />
        
        <PrimaryButton 
        label="Regresar"
        onPress={()=>navigator.dispatch(StackActions.popToTop())} />
    </View>
  )
}
~~~
------

## Drawer Navigation

- Es el menu lateral
- Se puede personalizar, pero el comportamiento que viene predefinido es el de mostrar enlaces
- Configuración

> npm i @react-navigation/drawer react-native-reanimated

- Creo el componente en /routes/SideMenuNavigator
- Coloco el StackNavigator

~~~js
import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'

const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {
  
    return (
    <Drawer.Navigator>
        <Drawer.Screen name="StackNavigator" component={StackNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

export default SideMenuNavigator
~~~

- Dentro del NavigationContainer, en lugar del StackNavigator muestor el SideMenuNavigator

~~~js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SideMenuNavigator from './src/presentation/routes/SideMenuNavigator';


export const App=(): React.JSX.Element=> {

  return (
    <NavigationContainer>
        <SideMenuNavigator />
    </NavigationContainer>
  );
}
~~~

- A veces da problemas el BUILD con el reanimated, prueba de mover el proyecto a un Path más corto y un nombre de carpeta mas corto
- También puede ayudar este comando para que borre la info preprocesada
- Para resolver el error de can´t read isConfigured of undefined ir a babel.config.js y añadir

> npx react-native start --resetCache

~~~js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin']
};
~~~
----

## Toggle Drawer - Mostrar/Ocultar

- Quiero simular el botón del Drawer debajo del Header, donde dice Home. No lo quiero en el Header
- Voy a HomeScreen, creo un botón Menu con un useEffect y usando el **navigation.setOptions** lo coloco a la izquierda
- Para hacer que tenga el comportamiento del Drawer uso el onPress
- Para tiparlo en el useNavigation puede ser un poco complicado, por eso uso el **dispatch con el DrawerActions**
- Notar que el callback de headerLeft no está entre llaves si no **entre paréntesis haciendo el return implícito**

~~~js
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../theme/theme'
import { type NavigationProp, useNavigation, DrawerActions } from '@react-navigation/native'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import type {RootstackParams } from '../../routes/StackNavigator'

export const HomeScreen = () => {
  
  const navigation = useNavigation<NavigationProp<RootstackParams>>()

  useEffect(() => {

    navigation.setOptions({
      headerLeft:()=>( 
        <Pressable onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer)} >
        <Text>Menu</Text> 
        </Pressable>
      )
    })

  }, [])
  
  
  return (
    <View style={globalStyles.container} >
      <PrimaryButton label={"Products"} onPress={()=> navigation.navigate("Products")} />
      <PrimaryButton label={"Settings"} onPress={()=> navigation.navigate("Settings")} />
    </View>
  )
}
~~~

- En ios, al desplegar el drawer, empuja el contenido, en Android se coloca por encima
-----

## Drawer Personalizado

- En **Drawer.Navigator** tengo un montón de propiedades. Una de ellas es **screenOptions**
- Con drawerType en slide empuja los elementos al desplegar el menú lateral

~~~js
import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'

const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {
  
    return (
    <Drawer.Navigator screenOptions={{
      headerShown: false,
      drawerType: 'slide',
      drawerActiveBackgroundColor: 'orange',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerItemStyle:{
        borderRadius: 100,
        paddingHorizontal: 20
      }
      }} >
        <Drawer.Screen name="MenuItem1" component={StackNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

export default SideMenuNavigator
~~~

- Cuando necesito un nivel más alto de personalización, puedo crear un nuevo componente y colocarlo en la prop drawerContent
- Le paso las props DrawerContentComponentProps
- Dentro creo un DrawerContentScrollview y le meto un View con estilos
- A DrawerItemList le esparzo las props
- Le paso el componente a drawerContent y esparzo las props, que en este caso es lo que hay en **screenOptions**

~~~js
import React from 'react'
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'
import { View, Text } from 'react-native'


const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {
  
    return (
    <Drawer.Navigator 
      drawerContent={(props)=> <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'slide',
      drawerActiveBackgroundColor: 'orange',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerItemStyle:{
        borderRadius: 100,
        paddingHorizontal: 20
      }
      }} >
        <Drawer.Screen name="MenuItem1" component={StackNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

const CustomDrawerContent = (props: DrawerContentComponentProps)=>{
  
  return(<DrawerContentScrollView>
    <View style={{
      height: 200,
      backgroundColor: '#ded1a9',
      margin: 30,
      borderRadius: 50
    }}></View>

    <DrawerItemList {...props} />
  </DrawerContentScrollView>)
}

export default SideMenuNavigator
~~~

- Cuando pongo la pantalla horizontal queda mucho espacio abajo, podría mostrar el menú
- No es para nada complicado. Utilizo **useWindowDimensions** para obtener las dimensiones de la pantalla
- Si en lugar de 'slide' en la propiedad drawerTpe coloco 'permanent' siempre se muestra el menú
- renderizo condicionalmente según las dimensiones de la pantalla para que siempre se muestre el menú cuando esté en horizontal

~~~js
import React from 'react'
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'
import { View, Text, useWindowDimensions } from 'react-native'


const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {

  const dimensions = useWindowDimensions();
  
    return (
    <Drawer.Navigator 
      drawerContent={(props)=> <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: dimensions.width >= 758? 'permanent': 'slide', //siempre se mostrará el menú en horizontal
      drawerActiveBackgroundColor: 'orange',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerItemStyle:{
        borderRadius: 100,
        paddingHorizontal: 20
      }
      }} >
        <Drawer.Screen name="MenuItem1" component={StackNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

const CustomDrawerContent = (props: DrawerContentComponentProps)=>{
  
  return(<DrawerContentScrollView>
    <View style={{
      height: 200,
      backgroundColor: '#ded1a9',
      margin: 30,
      borderRadius: 50
    }}><Text style={{color: 'white', fontSize:30, lineHeight: 200, textAlign: 'center'}}>Image</Text>
    </View>

    <DrawerItemList {...props} />
  </DrawerContentScrollView>)
}

export default SideMenuNavigator
~~~
-----

## useSafeAreaInserts

- Voy a ProfileScreen
- A veces hay teléfonos que tienen un notch muy grande y no es seguro que haya contenido en esa zona del teléfono
- El SafeAreaView limita como muestro el contenido, por ejemplo con un ScrollView
- Para que no limite el scroll usamos useSfaeAreaInsets
- Uso el dispatch con DrawerActions para disparar en el onPress el Menu
- Puedo tipar el useNavigation si así lo deseo
- También se puede trabajar siempre con el dispatch, con rutas específicas (se verá más adelante)

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export const ProfileScreen = () => {

  const {top} = useSafeAreaInsets()
  const navigator = useNavigation()
  
  return (
    <View style={{flex: 1, paddingHorizontal: 20, marginTop: top+10}}>
        <Text style={{textAlign: 'center', fontSize:30, marginBottom: 10}} >Profile</Text>

        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 10}}>
          <PrimaryButton label="Abrir Menú" onPress={()=>navigator.dispatch(DrawerActions.toggleDrawer)}/>
        </View>
    </View>
  )
}
~~~
-------

## Bottom Tabs, Material Top Tabs

- Instalación

> npm i @react-navigation/bottom-tabs

- En src/routes creo BottomNavigator.tsx

~~~js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tab1Screen } from '../screens/tabs/Tab1Screen';
import { Tab2Screen } from '../screens/tabs/Tab2Screen';
import { Tab3Screen } from '../screens/tabs/Tab3Screen';

const Tab = createBottomTabNavigator();

export const BottomNavigator=()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tab1" component={Tab1Screen} />
      <Tab.Screen name="Tab2" component={Tab2Screen} />
      <Tab.Screen name="Tab3" component={Tab3Screen} />
    </Tab.Navigator>
  );
}
~~~

- Hay que determinar en qué momento voy a mostrar el Bottom
- Para mantener el Drawer, en liugar del StackNavigator coloco el BottomNavigator
- App.tsx

~~~js
import React from 'react'
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer'
import { StackNavigator } from './StackNavigator'
import { ProfileScreen } from '../screens/profiles/ProfileScreen'
import { View, Text, useWindowDimensions } from 'react-native'
import { BottomNavigator } from './BottomNavigator'


const Drawer = createDrawerNavigator()

const SideMenuNavigator = () => {

  const dimensions = useWindowDimensions();
  
    return (
    <Drawer.Navigator 
      drawerContent={(props)=> <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: dimensions.width >= 758? 'permanent': 'slide', //siempre se mostrará el menú en horizontal
      drawerActiveBackgroundColor: 'orange',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerItemStyle:{
        borderRadius: 100,
        paddingHorizontal: 20
      }
      }} >
        <Drawer.Screen name="Home" component={BottomNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}

const CustomDrawerContent = (props: DrawerContentComponentProps)=>{
  
  return(<DrawerContentScrollView>
    <View style={{
      height: 200,
      backgroundColor: '#ded1a9',
      margin: 30,
      borderRadius: 50
    }}><Text style={{color: 'white', fontSize:30, lineHeight: 200, textAlign: 'center'}}>Image</Text>
    </View>

    <DrawerItemList {...props} />
  </DrawerContentScrollView>)
}

export default SideMenuNavigator
~~~

- Necesito el menú de hamburguesa para desplegar el menú lateral
- Primero personalicemos el BottomNavigator
- Uso sceneContainerStyle para el background de la pantalla
- Uso otras props para personalizar
- En options, puedo pasarle el título para que se muestre arriba
- También el tabBarIcon que pide un functional component, le puedo pasar un icono o lo que yo quiera
  - Puedo desestructurar el color de las props.
  - Esto hace que el color del icono (en este caso el texto) sea visible cuando la tab esté activa

~~~js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tab1Screen } from '../screens/tabs/Tab1Screen';
import { Tab2Screen } from '../screens/tabs/Tab2Screen';
import { Tab3Screen } from '../screens/tabs/Tab3Screen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const BottomNavigator=()=> {
  return (
    <Tab.Navigator
    sceneContainerStyle={{
        backgroundColor: 'rgba(241, 237, 231, 0.2)',
    }}
    screenOptions={{
        //headerShown: false,
        tabBarLabelStyle:{
            marginBottom: 5
        },
        headerStyle: { //eliminar la linea 
            elevation: 0,
            borderColor: 'transparent',
            shadowColor: 'transparent'
        },
        tabBarStyle:{ //para eliminar la linea en ios
            borderTopWidth: 0,
            elevation: 0
        }

    }}
    >
      <Tab.Screen name="Tab1" options={{title: "Tab1", tabBarIcon: ({color})=>(<Text style={{color: color}}>Tab</Text>)}} component={Tab1Screen} />
      <Tab.Screen name="Tab2" options={{title: "Tab2", tabBarIcon: ({color})=>(<Text style={{color: color}}>Tab</Text>)}}  component={Tab2Screen} />
      <Tab.Screen name="Tab3" options={{title: "Tab3", tabBarIcon: ({color})=>(<Text style={{color: color}}>Tab</Text>)}}  component={Tab3Screen} />
    </Tab.Navigator>
  );
}
~~~
----

## Menú de hamburguesa

- En Tab1Screen llamo al useNavigation
- Uso de nuevo el useEffect con navigation.setOptions

~~~js
import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'

export const Tab1Screen = () => {

  const navigation = useNavigation()

  useEffect(()=>{
    navigation.setOptions({
      headerLeft: ()=>(
       <Pressable onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer)}>
        <Text>Menu</Text>
       </Pressable> 
      )
    })
  }, [])

  return (
    <View>
        <Text>Tab1Screen</Text>
    </View>
  )
}
~~~

- Ahora aparece el Menu que si toco me muestra el menú lateral
- Hacer esto en cada uno de los tabs no sería lo adecuado. Mejor crear un componente para ello
- Creo en componentes/shared/HamburguerMenu.tsx

~~~js
import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, Text } from 'react-native'

const HamburguerMenu = () => {
  
    const navigation = useNavigation()

    useEffect(()=>{
      navigation.setOptions({
        headerLeft: ()=>(
         <Pressable onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer)}>
          <Text>Menu</Text>
         </Pressable> 
        )
      })
    }, [])
  
    return (<></>) //hay que regresar siempre un JSX, se puede usar un Fragment vacío
}

export default HamburguerMenu
~~~

- Lo coloco en el return de Tab1, Tab2 y Tab3
------ 

## Material Top Navigator

- Instalación

> npm i @react-navigation/material-top-tabs react-native-tab-view
> npm i react-native-pager-view

- Copio el ejemplo de la documentación y lo adapto a mi contenido

~~~js
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileScreen } from '../screens/profiles/ProfileScreen';
import { AboutScreen } from '../screens/about/AboutScreen';

const Tab = createMaterialTopTabNavigator();

export const  TopNavigator=()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}
~~~

- Para usarlo, pongamos que quiero mostrarlo en el Tab2
- Entonces, voy a BottomNavigator, y en lugar de mostrar el Tab2Screen, coloco el TopNavigator

~~~js
<Tab.Screen name="Tab2"  options={{title: "Tab2", tabBarIcon: ({color})=>(<Text style={{color: color}}>Tab</Text>)}}  component={TopNavigator} />
~~~
------

## Instalar iconos

> npm i react-native-vector-icons
> npm i -D @types/react-native-vector-icons

- Editar android/app/build.gradle

~~~
project.ext.vectoricons =[
  iconFontNames: ['Ionicons.ttf']
]

apply from: file ("../../node_modules/react-native-vector-icons/fonts.gradle")
~~~

- Para usarlo importo Icon

~~~js
import React from 'react'
import {Text, View } from 'react-native'
import HamburguerMenu from '../../components/shared/HamburguerMenu'
import Icon from 'react-native-vector-icons/Ionicons'

export const Tab3Screen = () => {
  return (
    <View>
      <HamburguerMenu />
        <Text style={{fontSize:40, textAlign: 'center', marginVertical: 10}}>Tab3Screen</Text>
        <Icon name='rocket' size={30} color="#2d6ab9" style={{textAlign: 'center'}} />
    </View>
  )
}
~~~

- Para colocar los iconos en las Tabs puedo usar Icon o customizar un componente

~~~js
import React from 'react'
import { Icon } from 'react-native-vector-icons/Icon'

interface Props{
    name: string
    size: number
    color: string
}


const IconComponent = ({name,size,color}: Props) => {
  return (
    <Icon name={name} size={size} color={color}     />
  )
}

export default IconComponent
~~~

- Ahora solo tengo que colocarlo.

~~~js
import React from 'react'
import {Text, View } from 'react-native'
import HamburguerMenu from '../../components/shared/HamburguerMenu'
import Icon from 'react-native-vector-icons/Ionicons'

export const Tab3Screen = () => {
  return (
    <View>
      <HamburguerMenu />
        <Text style={{fontSize:40, textAlign: 'center', marginVertical: 10}}>Tab3Screen</Text>
        <Icon name='rocket' size={30} color="#2d6ab9" style={{textAlign: 'center'}} />
    </View>
  )
}
~~~

- Para colocarlo en las tabs

~~~js
<Tab.Screen name="Tab3" options={{title: "Tab3", tabBarIcon:()=><IconComponent name="bicycle" size={30} color="orange" /> }}  component={Tab3Screen} />
~~~