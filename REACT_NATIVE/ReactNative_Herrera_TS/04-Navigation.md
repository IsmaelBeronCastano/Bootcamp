# REACT NATIVE - NAVIGATION

## NOTA: si el proyecto da problemas con gradle hay que ir a Android Studio Preferences / Build, Execution, Deployment / Build Tools / Gradle y en Gradle JDK escoger la versión de Java instalada o probar diferentes SJDK ( o descargar )
------

## Navegación

- Hay varios tipos de navegación
  - **Stack Navigation**
    - Stack porque coloca una screen **encima de la otra**, tiene el screen de atrás activo
      - Nos movemos entre ellas usando **navigation.navigate**, usualmente se maneja con hooks y se envía por las props
      - Para deshacernos de la screen anterior se usa **navigation.pop**, **goBack** irá a la screen anterior, **popToTop** irá a la primera screen
  - **Drawer Navigation**
  - **BottomTab Navigation**
  - **MaterialTop Navigation**
- **El stack no existe**, hay que crearlo.
- Instalar **@react-navigation/native** y **react-native-safe-area-context react-native-screens** (windows)
- Hay que añadir al cuerpo de la clase MainActivity en *android/app/src/main/java/nombre-del-paquete/MainActivity.java* lo siguiente
- **Shortcut** en VSCODE: Ctrl +P y el nombre del archivo MainActivity.java
- Añadir **import android.os.Bundle**

~~~java
@Override
protected void onCreate(Bundle svaedInstanceState){
    super.onCreate(null)
}
~~~ 
- Hay que importar react-native-gesture-handler **antes de la importación de React en App** 
- Hay que **envolver toda la aplicación dentro de NavigationContainer**
  - Este NavigationContainer me va a servir **para todos los tipos de navegación**

# Stack Navigation

- El paquete que interesa para crear el stack es **createStackNavigator** (es posible que en versiones posteriores no sea necesario)
- Hay que instalar **@react-navigation/stack** y **react-native-gesture-handler**
- También **@react-native-masked-view/masked-view**
- En el punto superior de mi aplicación (App.tsx) debo importar antes de la importación de React **react-native-gesture-handler**
- Creo una carpeta llamada **navigator donde tendré mis diferentes tipos de navegación**
- Creo StackNavigator.tsx y las páginas para mostrar
- En **options** le añado el título para mostrar en la screen

~~~js
const Stack = createStackNavigator()

export const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pagina1Screen" options={{ title:"Página 1" }} component={ Pagina1Screen } />
      <Stack.Screen name="Pagina2Screen" options={{ title:"Página 2" }} component={ Pagina2Screen } />
      <Stack.Screen name="Pagina3Screen" options={{ title:"Página 3" }} component={ Pagina3Screen } />
      <Stack.Screen name="PersonaScreen" component={ PersonaScreen } />
    </Stack.Navigator>
  );
}
~~~

- En Stack.Navigator tengo disponible **initialRouteName** al que le puedo pasar el nombre del componente para que lo muestre como primera página
- También dispongo de **screenOptions** para aplicar estilos. Usar Ctrl + space para ver las opciones disponibles
  - **headerShown: false** elimina el header

~~~js
    <Stack.Navigator
      // initialRouteName="Pagina2Screen"
      screenOptions={{
        headerStyle: {
          elevation: 0, //solo para android, desaparece la linea del header 
          shadowColor: 'transparent' //lo mismo para ios
        },
        cardStyle: {
          backgroundColor: 'white'
        }
      }}
    >
~~~

- Por defecto el Stack crea un header que vamos a personalizar
- En las props de cada página voy apoder desestructurar toda la info de la ruta
- Para tener la ayuda de Typescript si tipo las props de tipo any no voy a disponer de ella
- Para tiparlas uso la interface que hereda de **StackScreenProps**, me pide un objeto y las propiedades de ese objeto
- Ya puedo usar **naviation.navigate** para ir a otra página

~~~js
interface Props extends DrawerScreenProps<any, any>{};

export const Pagina1Screen = ({ navigation }: Props ) => {
    return(
            <View style={ styles.globalMargin }>
            <Text style={styles.title }>Pagina1Screen </Text>
            <Button 
                title="Ir página 2"
                onPress={ () => navigation.navigate('Pagina2Screen') } //debe existir el componente en el StackNavigator
            />
            </View>
    )
}
~~~

- También podría usar el hook useNavigation() y emplearlo de igual forma
- Los hooks son muy rápidos y eficientes

~~~js
const navigator = useNavigation()

   <Button 
    title="Ir página 2"
    onPress={ () => navigator.navigate('Pagina2Screen') }
    />
~~~

- Uso el **.pop para regresar a la página anterior** y el **.popToTop** para volver a la **página principal**

~~~js
  <Button 
    title="Regresar"
    onPress={ () => navigation.pop('Pagina2Screen') }
    />
  <Button 
    title="Home"
    onPress={ () => navigation.popToTop('Pagina1Screen') }
    />
~~~

## Estilos

- Creo la carpeta theme/appTheme.tsx para la styleSheet

~~~js
import { StyleSheet } from 'react-native';

export const colores = {
    primary: '#5856D6',

}


export const styles = StyleSheet.create({
    globalMargin: {
        marginHorizontal: 20
    },
    title: {
        fontSize: 30,
        marginBottom: 10
    },
    botonGrande: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    botonGrandeTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 100
    },
    menuContainer: {
        marginVertical: 30,
        marginHorizontal: 50,
    },
    menuBoton: {
        marginVertical: 10
    },
    menuTexto: {
        fontSize: 20
    }
});
~~~

- Uso el useEffect para cambiar en la Página 2 el Página 1 que se ve en el top left por un Back

~~~js
useEffect(() => {
    navigator.setOptions({
        title: 'Hola Mundo', //sobreescribe el title del padre
        headerBackTitle: 'Atrás' //Sobreescribe el botón de regreso 
    })
}, [])
~~~
--------

## Enviar argumentos entre pantallas

- Para enviar argumentos a otras pantallas simplemente los pongo detrás de una coma en un objeto
- La info es enviada en las props (de PersonaScreen)

~~~js
<TouchableOpacity
  onPress={()=> navigation.navigate("PersonaScreen",{
    id: 1,
    nombre: "Pere"
  })}
>
  <Text>Click</Text>

</TouchableOpacity>
~~~

- Para imprimirlas puedo usar un console.log en PersonaScreen con **JSON.stringify(props, null, 3)**
  - El null es para indicar que no hay replacer, y el 3 es el gap de separación
  - En **route** están los argumentos (id, nombre, key)
  - Me sirve para imprimir en pantalla objetos
- Hay varias maneras de extraerlas
- **Esta es la manera sucia** (tipando con any)
- Desestructuro **el route** de las props, donde están los argumentos
- Extraigo los argumentos de **route.params**

~~~js
interface Props extends StackScreenProps<any,any>{}

export const PersonaScreen = ({route}: Props) =>{

  const params = route.params

return()
}
~~~

- Si quisiera usar el nombre que envío para cambiar el titulo de la pantalla y poner el nombre en lugar de PersonaScreen, puedo desestructurar navigation del objeto de las props

~~~js
interface Props extends StackScreenProps<any,any>{}

export const PersonaScreen = ({route, navigation}: Props) =>{

  const params = route.params

  useEffect(()=>{
    navigation.setOptions({
      title: params!.nombre  //Uso ! para forzar, es decirle a TypeScript "eh, se lo que estoy haciendo" Si no marca error pq
                              //podría venir undefined
    })
  },[])

return()
}
~~~

- Hay 2 estrategias mejores
- La primera es crear una interfaz personalizada basada en le info que el componente va a recibir

~~~js
interface RouteParams{
  id: number,
  nombre: string
}

interface Props extends StackScreenProps<any,any>{}

export const PersonaScreen = ({route, navigation}: Props) =>{

  const params = route.params as RouteParams //aplico la interfaz aqui

  useEffect(()=>{
    navigation.setOptions({
      title: params.nombre  //Ya no hace falta poner !
    })
  },[])

return()
}
~~~

- La otra estrategia es **la más recomendable**, se trata de indicar en el StackNavigator qué propiedades va a recibir qué página
- Ponemos **undefined** para que quede claro que no recibimos nada y dejar cierta flexibilidad
- Este proceso es el **recomendado por React-Navigator**
~~~js
export type RootStackParams = {
  Pagina1Screen: undefined,
  Pagina2Screen: undefined,
  Pagina3Screen: undefined,
  PersonaScreen: { id: number, nombre: string }, //aquí puedo pasarle una interfaz
}


const Stack = createStackNavigator<RootStackParams>(); //lo defino aqui

export const StackNavigator = () => {
  return (
    {...code}
  )
}
~~~

- Para tiparlo en PersonaScreen, coloco el cursor encima de los **any** y tengo **ParamList** y **RouteName**
  - El ParamList es el tipo que creamos (RootStackParams)
  - Y el Routename es el nombre de la ruta en la que nos encontramos que definimos en el tipo, en este caso PersonaScreen
  - Hay que mandarlo como un screen

~~~js
// interface RouterParams {
  //     id: number;
//     nombre: string
// }

interface Props extends StackScreenProps<RootStackParams, 'PersonaScreen'>{};

export const PersonaScreen = ( { route, navigation }: Props ) => {
  
  const params = route.params;
    return(
      {...code}
    )
 }
~~~

- Esta es **LA MANERA RECOMENDADA POR REACT-NAVIGATOR**
- Recuerda que para extraer los estilos puedo usar el operador spread y cambiar los que considere
------

# Drawer Navigation

- Es el tipo de navegación donde aparece un **menú lateral** (izquierdo o derecho) usado **para mostrar información del usuario y enlaces**
- **Hay que construir el Drawer**. Tiene que saber **qué pantallas** puede navegar 
- Se puede personalizar su comportamiento. El predefinido es el de mostrar enlaces

### Configurar Drawer básico

- Necesitamos el createDrawerNavigator. **Seguir documentación oficial**
- **Previamente hay que hacer las mismas instalacion que se hicieron con el Stack** (instalar react-native-gesture-handler, reanimated y demás)
- Instalo @react-navigation/drawer

~~~js
import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { StackNavigator } from './StackNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useWindowDimensions } from 'react-native';

const Drawer = createDrawerNavigator(); //Creo el Drawer

export const MenuLateralBasico = () => {
  
    const { width } = useWindowDimensions();

    return (
    <Drawer.Navigator
      drawerType={ width >= 768 ? 'permanent' : 'front' } //para mostrar permanentemente cuando se voltea el movil u ocultar en vertical
    >
      <Drawer.Screen name="StackNavigator" options={{ title: 'Home' }} component={ StackNavigator } />
      <Drawer.Screen name="SettingsScreen" options={{ title: 'Settings' }} component={ SettingsScreen } /> {/*Creo el componente*/}
    </Drawer.Navigator>
  );
}
~~~

- Lo coloco en App en lugar del Stack, dentro del NavigationContainer

~~~js

const App = () => {
  return (
    <NavigationContainer>    
        <MenuLateralBasico />
    </NavigationContainer>
  )
}
~~~
- **Si da error del reanimated cambiar la version por la anterior**
- Ya puedo desplegar el menú lateral desde la izquierda
  - Para cambiar la posición usar la propiedad drawerPosition (en "right") en Drawer.Navigator
    - Si no funciona recargar la app
    - Por norma general, cuando las cosas no funcionan, **RECARGA EL METRO**
- Quiero poner un icono en el topLeft a modo de **Toggle para mostrar el menú lateral**
- Voy a la página donde quiero que se muestre el Toggle (Pagina1Screen)
- Tengo que hacer como si quisiera cambiarle el título, tengo que usar el **navigation de las props**

~~~js
import React, { useEffect } from 'react'
import { Button, Text, View, TouchableOpacity } from 'react-native'
// import { StackScreenProps } from '@react-navigation/stack'
import { DrawerScreenProps } from '@react-navigation/drawer';
import { styles, colores } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props extends DrawerScreenProps<any, any>{}; //El Stack ahora está dentro del Drawer.Navigator en MenuLateralBasico, 
                                                      //uso DrawerScreenProps

export const Pagina1Screen = ({ navigation }: Props ) => {

    useEffect(() => {
        
        navigation.setOptions({
            headerLeft: () => (  //headerLeft recibe una función que tiene que regresar un JSX
                <TouchableOpacity
                    style={{
                        marginLeft: 10
                    }}
                    onPress={ () => navigation.toggleDrawer()  } //Muestra el menú con un click, desaparece con un clic afueraq
                                                                //o seleccionando una opción
                >
                    <Icon     
                        name="menu-outline"
                        color={ colores.primary }
                        size={ 35 }
                    />
                </TouchableOpacity>
            )
        })
         }
    )
}
~~~ 
----

## Drawer Personalizado

- Copio y pego el drawer anterior y lo renombro a MenuLateral
- Aunque el **Drawer.Navigator** tiene los hijos Drawer.Screen, **no puedo ponerle otros componentes dentro como un View**
  - Solo pueden haber pantallas
- Con **drawerContent** recibe **una función** donde recibe como argumento **las props**.
  - Dentro de estas props viene la navegación
- Creo el componente **MenuInterno** para pasárselo a la función
- Si coloco el cursor encima me dice que las props son de tipo **DrawerContentComponentProps** del tipo **DrawerContentOptions**
  - Los importo. Ahora necesito recibir las props
  - Le paso **las props por desestructuración**
- Uso **DrawerContentScrollView** como container. Ahora puedo usar el hook **useNavigation** y poder navegar a otras pantallas
- El componente **Image** obliga al **src**
- Creo los links con **TouchableOpacity** con un **Text** donde diga lo que quiero mostrar
- Para navegar uso el **navigationr** en el **onPress**. **Lo desestructuro de las props de MenuInterno**, viene del **Drawer**
- **Hay un hook para customizar el SafeArea, pero se verá más adelante**

~~~js
import React from 'react';

import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView } from '@react-navigation/drawer';

import { SettingsScreen } from '../screens/SettingsScreen';
import { Image, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native';
import { styles } from '../theme/appTheme';
import { Tabs } from './Tabs';
import Icon from 'react-native-vector-icons/Ionicons';


const Drawer = createDrawerNavigator();



export const MenuLateral = () => {
  
    const { width } = useWindowDimensions();

    return (
    <Drawer.Navigator
      drawerType={ width >= 768 ? 'permanent' : 'front' }
      drawerContent={ (props) => <MenuInterno { ...props } /> }
    >
      <Drawer.Screen name="StackNavigator" component={ StackNavigator } />
      <Drawer.Screen name="SettingsScreen" component={ SettingsScreen } />
    </Drawer.Navigator>
  );
}

const MenuInterno = ( { navigation }: DrawerContentComponentProps<DrawerContentOptions>) => {

  return (
    <DrawerContentScrollView>

      {/* Parte del avatar */}
      <View style={ styles.avatarContainer }>
        <Image 
          source={{
            uri: 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif'
          }}
          style={ styles.avatar }
        />
      </View>


      {/* Opciones de menú */}
      <View style={ styles.menuContainer }>

          <TouchableOpacity 
            style={{ 
              ...styles.menuBoton,
              flexDirection: 'row'
            }}
            onPress={ () => navigation.navigate('StackNavigator') }
          >
            <Icon name="compass-outline" size={ 23 } color="black" />
            <Text style={ styles.menuTexto }> Navegacion</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              ...styles.menuBoton,
              flexDirection: 'row'
            }}
            onPress={ () => navigation.navigate('SettingsScreen') }
          >
            <Icon name="cog-outline" size={ 23 } color="black" />
            <Text style={ styles.menuTexto }> Ajustes</Text>
          </TouchableOpacity>

      </View>

    </DrawerContentScrollView>
  );
}
~~~
-----

## useSafeAreaInserts

- Cuando voy a la pantalla de Settings no tengo el header, con los botones de navegación, el título, etc
- Hay varias maneras para que el Settings tenga el mismo header que el Stack
- Puedo crearme otro Stack en el cual solo esté esta pantalla

~~~js
const Stack = createStackNavigator()

const SettingsStackScreen = ()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen 
      name="SettingsScreen"
      component={SettingsScreen}>

      </Stack.Screen>
    </Stack.Navigator>
  )
}
~~~

- Pero en lugar de crear otro componente, puedo crear un **custom hook** que se encargue de ello
- Uso el custom hook **useSafeAreaInsets()**, lo guardo en insets
- De esta manera puedo usar un **View directamente** y no otro componente con un View dentro
- Así también obtiene las dimensiones **a tiempo real**
- Ahora en insets tengo el top, left, right, bottom para que pueda mostarr el contenido de manera segura

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles, colores } from '../theme/appTheme';

export const SettingsScreen = () => {

    const insets = useSafeAreaInsets(); //custom hook


    return (
        <View style={{ 
            ...styles.globalMargin,
            marginTop: insets.top + 20
        }}>
            <Text style={ styles.title }>Settings Screen</Text>
        </View>
    )
}
~~~
---------

# BottomTab Navigation / MaterialTop Navigation

- **Top Tab Navigation** es el típico menú en el top de la pantalla
- También lo podemos tener en el **bottom** (¡o los dos!)
- Previamente hay que instalar todos los paquetes necesarios de react-navegation hechos al principio
- Además necesitamos los específicos para esta tarea (**Getting Started**)
  - Para ios usaremos **createBottomNavigator**
  - Instalamos **@react-navigation/bottom-tabs**
  - Para android **creatematerialBottomNavigator**
    - Instalamos **@react-navigation/material-bottom-tabs react-native-paper**
- También usaremos **createMaterialTopTabNavigator**
  - Instalamos 

## BottomTab Navigator

- Cada uno de estos **Tabs** (en el bottom) se van a mantener activos la primera vez que se cargue
- Los tres **son cargados bajo demanda**
- Cuando le des al Tab 1 se van a cargar los **useEffects** que tengamos ahi
- Si el **useEffect** no tiene ninguna dependencia, aunque vayas al Tab2 o Tab3, no se volverán a ejecutar esos useEffect
- Cuando entres en el Tab2 se dispararán sus useEffects, pero no se volverán a disparar si salgo de él y vuelvo
- Estos **Tabs serán screens** cómo hemos estado viendo hasta ahora
  - Cada uno de estos screens pueden ser un screen, un Stack, Tabs, TopTabs...
- En nuestra app el **Drawer va a ser la navegación principal**
  - Este puede definirme a qué pantalla quiero moverme
  - Puedo moverme a Settings, pero ahora, en lugar de poner el StackNavigator pondremos **TabsComponent con BottomTabs**
    - Esta pantall va a tener **Tab1Screen**, **Tab2Screen**, **StackNavigator**
    - El **StackNavigator** tendrá **Página1, Página2, Página3...**

### Crear el BottomTabNavigator

- Lo que quiero es que al desplegar el menu lateral del Drawer (dónde tengo dos opciones: Navegación y Settings), al elegir Navegación vaya a la pantalla **con los tres Tabs en el bottom**
- Creo Tabs.tsx
- Creo la navegación como se hizo anteriormente

~~~js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const BottomTabAndroid = createMaterialBottomTabNavigator();

export const TabAndroid =()=>{
return(
  <BottomTabAndroid.Navigator>
  <BottomTabAndroid.Screen name="Tab1Screen" options={{ title: 'Tab1' }} component={ Tab1Screen } />
      <BottomTabAndroid.Screen name="Tab2Screen" options={{ title: 'Tab2' }} component={ TopTabNavigator } />
      <BottomTabAndroid.Screen name="StackNavigator" options={{ title: 'Stack' }} component={ StackNavigator } />
    </BottomTabAndroid.Navigator>
  )
}
~~~
- Creo **Tab1Screen.tsx y Tab2Screen.tsx** con un View y un Text de momento
- Usemos estos Tabs en App
- Como quiero seguir usando el menú lateral (Drawer), pondré que muestre los tabs en el primer link del menú lateral donde dice Navegación
- Para ello voy al** Menu Lateral y en lugar del StackNavigator pongo el componente Tabs**
- También debo cambiar el componente en el **onPress** para que cambie la navegación

~~~js
export const MenuLateral = () => {
  
    const { width } = useWindowDimensions();

    return (
    <Drawer.Navigator
      drawerType={ width >= 768 ? 'permanent' : 'front' }
      drawerContent={ (props) => <MenuInterno { ...props } /> }
    >
      <Drawer.Screen name="Tabs" component={ Tabs } /> {/*Coloco Tabs en lugar del Stack*/}
      <Drawer.Screen name="SettingsScreen" component={ SettingsScreen } />
    </Drawer.Navigator>
  );
}

const MenuInterno = ( { navigation }: DrawerContentComponentProps<DrawerContentOptions>) => {

  return (
    <DrawerContentScrollView>

      {/* Parte del avatar */}
      <View style={ styles.avatarContainer }>
        <Image 
          source={{
            uri: 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif'
          }}
          style={ styles.avatar }
        />
      </View>


      {/* Opciones de menú */}
      <View style={ styles.menuContainer }>

          <TouchableOpacity 
            style={{ 
              ...styles.menuBoton, //uso spread para traerme todos los estilos y añadir otros
              flexDirection: 'row' //flexDirection en row para que se coloque en fila con el texto y no encima (column)
            }}
            onPress={ () => navigation.navigate('Tabs') } {/*También debo acambiarlo aquí!!!*/}
          >
            <Icon name="compass-outline" size={ 23 } color="black" />
            <Text style={ styles.menuTexto }> Navegacion</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              ...styles.menuBoton,
              flexDirection: 'row'
            }}
            onPress={ () => navigation.navigate('SettingsScreen') }
          >
            <Icon name="cog-outline" size={ 23 } color="black" />
            <Text style={ styles.menuTexto }> Ajustes</Text>
          </TouchableOpacity>

      </View>

    </DrawerContentScrollView>
  );
}
~~~

### Personalizando el BottomNavigator

- En el Tab1Screen voy a usar un useEffect para comprobar que solo carga una vez
- Uso **useSafeAreaInserts** para las medidas del SafeArea
- Le aplico los estilos al View
- Uso **TouchableIcon** para los iconos 

### NOTA: Para usar los iconos hay que hacer una configuración en android/app/build.gradle detallada al final de esta página

~~~js
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'; //uso los iconos de IonIcons

import { Text, View } from 'react-native'
import { styles, colores } from '../theme/appTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableIcon } from '../components/TouchableIcon';


export const Tab1Screen = () => {

    const { top } = useSafeAreaInsets(); //para colocarlo según la medida del SafeArea (con el noutch)

    useEffect(() => {
        console.log('Tab1Screen effect'); //para comprobar que solo se carga una vez
    }, [])

    return (
        <View style={{                 {/*Le añado los estilos al View*/}
            ...styles.globalMargin,
            marginTop: top + 10
        }}
        >
            <Text style={ styles.title }> Iconos </Text>

            <Text>          
            {/*Para usar iconos hay que hacer una configuración previa detallada al final*/}
                <TouchableIcon iconName="airplane-outline" /> {/*Cargo iconos con TouchableIcon*/}
                <TouchableIcon iconName="attach-outline" />
                <TouchableIcon iconName="bonfire-outline" />
                <TouchableIcon iconName="calculator-outline" />
                <TouchableIcon iconName="chatbubble-ellipses-outline" />
                <TouchableIcon iconName="images-outline" />
                <TouchableIcon iconName="leaf-outline" />
            </Text>

        </View>
    )
}
~~~
- En lugar del Tab3 quiero mostrar el StackNavigator
- Para personalizar el BottomTabAndroid.Navigator puedo usar **tabBarOptions**
~~~js
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const BottomTabAndroid = createMaterialBottomTabNavigator();

export const TabAndroid =()=>{
return(
  <BottomTabAndroid.Navigator
  sceneContainerStyle={{
    backgroundColor: 'white'  //color de background de la screen
  }}
  tabBarOptions={{
    activeTintColor: 'red', //colores.primary
    style:{
      borderColor: 'red', //colores.primary
      borderTopWidth: 0, //quita la linea superior
      elevation: 0  //le quito la elevación que da una pequeña sombra
    },
    labelStyle:{
      fontSize: 15
    }
  }}
  >
  <BottomTabAndroid.Screen name="Tab1Screen" options={{ title: 'Tab1' }} component={ Tab1Screen } />
      <BottomTabAndroid.Screen name="Tab2Screen" options={{ title: 'Tab2' }} component={ TopTabNavigator } />
      <BottomTabAndroid.Screen name="StackNavigator" options={{ title: 'Stack' }} component={ StackNavigator } />
    </BottomTabAndroid.Navigator>
  )
}
~~~
- Puedo manejar los colores desde la styleSheet en lugar de ponerlo en duro, creo variables

~~~js
export const colores = {
    primary: '#5856D6',

}
~~~

### Preparar el espacio para el icono


- Hay dos maneras de colocar los iconos
- Una es hacerlo en el Tab.Navigator y otra en cada uno de los screens
- La manera más sencilla es configurarlo en el Tab.Navigator para hacerlo de manera automática
- En el screen es más código
  - El **tabBarIcon** me pide un jsx
  - De las props, puedo extraer color, focused ( si está seleccionado) y size
  - Son propiedades que el padre (tab.Navigator) se las da

~~~js
<BottomTabAndroid.Screen name="Tab2Screen" options={{ title: 'Tab2', tabBarIcon: (props)=><Text style={{color: props.color}}>T1</Text>}} component={ TopTabNavigator } />
~~~

- Si lo quiero hacer todo en el screen lo más lógico sería crearme una función donde reciba las props y devuelva el componente
- Voy a hacer la configuración en el padre
- Uso **screenOptions** de Tab.Navigator
  - Retorna una función que va a decidir que icono poner dependiendo de la ruta
  - Desestructura la ruta de las props
  - Puedo usar el **tabBarIcon** que usé antes
  - Desestructuro **color y focused de las props**
  - En **route.name** tengo los nombres de las rutas. (Lo que aparece en el name de Tab.Screen)
  - Inicializo iconName
  - Creo **un switch para evaluar según la ruta el icono a mostrar**
  - Retorno el **iconName** como la propiedad de name del componente **Icon**

~~~js
import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Platform, Text } from 'react-native';

import { Tab1Screen } from '../screens/Tab1Screen';
import { Tab2Screen } from '../screens/Tab2Screen';

import { StackNavigator } from './StackNavigator';
import { colores } from '../theme/appTheme';
import { TopTabNavigator } from './TopTabNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

//Este es el componente que renderizo en App
export const Tabs = () => {

  return Platform.OS === 'ios'   //renderizo condicionalmente si estoy en ios o android
          ? <TabsIOS />
          : <TabsAndroid />
}


const BottomTabAndroid = createMaterialBottomTabNavigator();

const TabsAndroid = () => {
  return (
    <BottomTabAndroid.Navigator
      sceneAnimationEnabled={ true }
      barStyle={{
        backgroundColor: colores.primary
      }}
      screenOptions={ ({ route }) => ({ //desestructuro la ruta de las props
        tabBarIcon: ({ color, focused }) => {

          let iconName: string = '';
            switch( route.name ) {
              case 'Tab1Screen':
                iconName = 'bandage-outline'
              break;

              case 'Tab2Screen':
                iconName = 'basketball-outline'
              break;

              case 'StackNavigator':
                iconName = 'bookmarks-outline'
              break;
            }

          return <Icon name={ iconName } size={ 20 } color={ color } />
        }
      })}
    >
      <BottomTabAndroid.Screen name="Tab1Screen" options={{ title: 'Tab1' }} component={ Tab1Screen } />
      <BottomTabAndroid.Screen name="Tab2Screen" options={{ title: 'Tab2' }} component={ TopTabNavigator } /> {/*Muestro el TopTabNavigator de la lección siguiente*/} 
      <BottomTabAndroid.Screen name="StackNavigator" options={{ title: 'Stack' }} component={ StackNavigator } /> {/*pongo el StackNavigator*/}
    </BottomTabAndroid.Navigator>
  );
}


const BottomTabIOS = createBottomTabNavigator();

const TabsIOS = () => {
  return (
    <BottomTabIOS.Navigator
        sceneContainerStyle={{
          backgroundColor: 'white'
        }}
        tabBarOptions={{
          activeTintColor: colores.primary,
          style: {
            borderTopColor: colores.primary,
            borderTopWidth: 0,
            elevation: 0,
          },
          labelStyle: {
            fontSize: 15
          }
        }}
        screenOptions={ ({ route }) => ({
          tabBarIcon: ({ color, focused, size }) => {

            let iconName: string = '';
            switch( route.name ) {
              case 'Tab1Screen':
                iconName = 'bandage-outline'
              break;

              case 'Tab2Screen':
                iconName = 'basketball-outline'
              break;

              case 'StackNavigator':
                iconName = 'bookmarks-outline'
              break;
            }

            return <Icon name={ iconName } size={ 20 } color={ color } />
          }
        })}
      >
      {/* <Tab.Screen name="Tab1Screen" options={{ title: 'Tab1', tabBarIcon: (props) => <Text style={{ color: props.color }} >T1</Text> }} component={ Tab1Screen } /> */}
      <BottomTabIOS.Screen name="Tab1Screen" options={{ title: 'Tab1' }} component={ Tab1Screen } />
      <BottomTabIOS.Screen name="Tab2Screen" options={{ title: 'Tab2' }} component={ TopTabNavigator } /> {/*Aqui también muestro el TopTabNavigator de la siguiente lección!!*/}
      <BottomTabIOS.Screen name="StackNavigator" options={{ title: 'Stack' }} component={ StackNavigator } />
    </BottomTabIOS.Navigator>
  );
}
~~~ 

## MaterialTop Navigation

- Usaré el **createMaterialTopTabNavigator**
- Hay que pasar por todo el Get Started de React Navigation
  - Instalo @react-navigation/material-top-tabs react-native-tab-view
- **NOTA:** Puede dar un error de "Unable to resolve module react-native-pager-view...". **resulta que no se instaló!**
  - **Instalalo manualmente**
  - Parece que la única manera de quitar el warning de ios es instalar la última versión de reanimated pero da problemas de compatibilidad
  - Por eso desactivo los warnings con LogBox

~~~js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ChatScreen } from '../screens/ChatScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { AlbumsScreen } from '../screens/AlbumsScreen';

import { LogBox, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/Ionicons';


LogBox.ignoreLogs(['Sending']) //desactivo los warnings que tengan 'Sending'


const Tab = createMaterialTopTabNavigator();

export const TopTabNavigator = () => {

  const { top:paddingTop } = useSafeAreaInsets() //renombro top a paddingTop asi no tengo que colocar paddingTop: top en style


  return (
    <Tab.Navigator
      style={{ paddingTop }}
      sceneContainerStyle={{
        backgroundColor: 'white' //fondo de la screen
      }}
      tabBarOptions={{
        pressColor: colores.primary, //para que aparezca el color custom al apretar
        showIcon: true, //si quiero poner un icono o un espacio hay que ponerlo en true
        indicatorStyle: { //la barra inferior cuando está activo
          backgroundColor: colores.primary
        },
        style: {
          shadowColor:'transparent', //para quitar la rayita divisoria en ios,
          borderWidth: 0, //quita la rayita divisoria
          elevation: 0, //quita la sombrita divisoria
        },
      }}
      screenOptions={ ({ route }) => ({
        tabBarIcon: ({ color, focused }) => {

          let iconName: string = '';
          switch( route.name ) {
            case 'Chat':
              iconName = 'chatbox-ellipses-outline'
            break;

            case 'Contacts':
              iconName = 'people-outline'
            break;

            case 'Albums':
              iconName = 'albums-outline'
            break;
          }

          return <Icon name={ iconName } size={ 20 } color={ color } />
        }
      })}
    >
      <Tab.Screen name="Chat" component={ ChatScreen } />
      <Tab.Screen name="Contacts" component={ ContactsScreen } />
      <Tab.Screen name="Albums" component={ AlbumsScreen } />
    </Tab.Navigator>
  );
}
~~~

- Para los iconos hay varios paquetes (FontAwesome, EvilIcons...)
- Instalar react-native-vector-icons
- Para Android se recomienda configurar mediante **Gradle**
- En **android/app/build.gradle** añadir

~~~js
project.ext.vectoricons = [
  iconFontNames : ['MaterialIcons.ttf', 'EvilIcons.ttf', 'IonIcons.ttf'] //carga solo los iconos que  quieras usar
]

apply from:"../../node_modules/react-native-vector-icons/fonts.gradle" //si solo coloco esta linea carga todos los iconos disponibles (mucho peso!) 
~~~

- Hay varias fuentes en el arreglo, pero solo voy a usar **IonIcons** 
- Para usarlo uso el import del paquete

~~~js
import Icon from 'react-native-vector-icons/dist/IonIcons'

const myIcon = <Icon name="nombre_del_icono" size={20} color="#333">
~~~

- Conviene usar los tipos para obtener la ayuda de TypeScript

> npm i -D @types/react-native-vector-icons

