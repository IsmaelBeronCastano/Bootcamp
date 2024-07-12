# React Native - Más Componentes

- Están configurados los iconos de Ionicons
- Creo la estructura de directorios
- En src
- Presentation
    - Components
        - Ui
    - Assets
    - Hooks
    - Navigator
    - Icons
    - Screens
        - Home/HomeScreen
        - Alerts
        - Animations
        - Inputs
        - Switches
        - ThemeChanger
        - Ui
- Renombro App a MasComponentes
- Muevo MasComponentes dentro de src
- Creo el HomeScreen.tsx
- En la carpeta Icons creo Icons.tsx

~~~js
import  Icon  from "react-native-vector-icons/Ionicons"

export const AirplaneIcon = ()=> <Icon  name='airplane-outline' size={30} />
~~~

- Para la navegación creo el Stack (la instalación ya está hecha)

~~~js
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';

const Stack = createStackNavigator();

export const StackNavigator =()=> {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

    </Stack.Navigator>
  );
}
~~~

- Coloco el StackNavigator dentro del NavigationContainer
- **NOTA:** Tengo configurado React Native Paper también

~~~js
import 'react-native-gesture-handler'
import React from 'react';
import {PaperProvider} from 'react-native-paper'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { HomeScreen } from './presentation/screens/home/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './presentation/navigator/StackNavigator';

export const ComponentsApp=(): React.JSX.Element=>{

  return(
      <NavigationContainer>
      <PaperProvider
      settings={({
         icon: (props)=> <IonIcon {...props} />
      })}
      >
         <StackNavigator />
         
      </PaperProvider>
      </NavigationContainer>

   )
}
~~~
----

## Menú Principal y Estilos

- Copio el menuItems del Gist adjunto con la lección en HomeScreen, luego le encontraremos un mejor lugar

> https://gist.github.com/Klerith/8cc5b908636c53ee91d2bdae7be0aa25

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { AirplaneIcon } from '../../icons/Icons'

export const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
      
    </View>
  )
}

export const menuItems = [
  // 01-animationMenuItems
  {
    name: 'Animation 101',
    icon: 'cube-outline',
    component: 'Animation101Screen',
  },
  {
    name: 'Animation 102',
    icon: 'albums-outline',
    component: 'Animation102Screen',
  },


  // 02-menuItems
  {
    name: 'Pull to refresh',
    icon: 'refresh-outline',
    component: 'PullToRefreshScreen',
  },
  {
    name: 'Section List',
    icon: 'list-outline',
    component: 'CustomSectionListScreen',
  },
  {
    name: 'Modal',
    icon: 'copy-outline',
    component: 'ModalScreen',
  },
  {
    name: 'InfiniteScroll',
    icon: 'download-outline',
    component: 'InfiniteScrollScreen',
  },
  {
    name: 'Slides',
    icon: 'flower-outline',
    component: 'SlidesScreen',
  },
  {
    name: 'Themes',
    icon: 'flask-outline',
    component: 'ChangeThemeScreen',
  },

  // 03- uiMenuItems
  {
    name: 'Switches',
    icon: 'toggle-outline',
    component: 'SwitchScreen',
  },
  {
    name: 'Alerts',
    icon: 'alert-circle-outline',
    component: 'AlertScreen',
  },
  {
    name: 'TextInputs',
    icon: 'document-text-outline',
    component: 'TextInputScreen',
  },
];
~~~

- Creo config/theme/theme.tsx, pego lo que hay en el Gist
- Hay una interfaz para los colores
- He colocado los colores en duro en los objetos con *colors.text*

~~~js
import { StyleSheet } from "react-native";

export interface ThemeColors {
  primary: string;
  text: string;
  background: string;
  cardBackground: string;
  buttonTextColor: string;
}

export const colors: ThemeColors = {
  primary: "#5856D6",
  text: "black",

  background: "#F3F2F7",
  cardBackground: "white",
  buttonTextColor: "white",
};

export const globalStyles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  globalMargin: {
    paddingHorizontal: 20,
    flex: 1,
  },

  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: colors.text,
    fontSize: 16,
  },
});
~~~

-  En HomeScreen, aplico los estilos a los view
- Coloco un ScrollView. el ScrollView no es perezoso, si tienes muchos elementos es mejor usar un FlatList
- Creo en comoponents/ui/Title.tsx
- Pongo el white y el safe (que son opcionales) en false por defecto
- En los estilos esparzo los estilos globales y añado las propiedades que necesito
- Si viene el white, el texto será white. Si viene el safe, usaré el top que extraigo de useSafeAreaInsets para que no choque con la parte superior

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { colors, globalStyles } from '../../../config/theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props{
    text: string
    safe?: boolean
    white?: boolean
}

export const Title = ({text, safe= false, white= false}: Props) => {

    const {top} = useSafeAreaInsets()
  return (
      <Text style={{
        ...globalStyles.title,
        marginTop: safe ? top : 0,
        marginBottom: 10,
        color: white ? 'white': colors.text

    }}>{text}</Text>
  )
}
~~~

- Lo coloco en el ScrollView con el safe en true (solo con colocar la prop es suficiente)

~~~js

export const HomeScreen = () => {
  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.globalMargin}>
        <ScrollView>
          <Title text="Opciones de Menú" safe />
        </ScrollView>
      </View>
      
    </View>
  )
}
~~~
-----

## Opciones del Menú

- Creo el components/ui/MenuItem.tsx
- Voy a usar el MenuItem para navegar, por lo que voy a usar un Pressable

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'
import  Icon  from 'react-native-vector-icons/Ionicons'

interface Props{
    name: string
    icon: string
    component?: string
}

export const MenuItem = ({name, icon, component}: Props) => {
  return (
        <Pressable
        onPress={()=>console.log('click')}
        >
            <View style={{
                ...styles.container,
                backgroundColor: colors.cardBackground
            }}>
                <Icon name={icon} size={25} style={{marginRight:10, color: colors.primary}} />
                <Text style={{color: colors.text}}>{name}</Text>
                <Icon name='chevron-forward-outline' size={25} style={{marginLeft: 'auto'}} color={colors.primary}/>

            </View>
        </Pressable>
  )
}


const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  }
})
~~~

- Hago un .map en el ScrollView y renderizo el MenuItem
- Puedo hacerlo así

~~~js

export const HomeScreen = () => {
  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.globalMargin}>
        <ScrollView>
          <Title text="Opciones de Menú" safe />

          {
            menuItems.map(item=>(
              <MenuItem key={item.component} icon={item.icon} name={item.name} />
            ))
          }
        </ScrollView>
      </View>
      
    </View>
  )
~~~

- Pero también puedo hacerlo usando el spread

~~~js
export const HomeScreen = () => {
  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.globalMargin}>
        <ScrollView>
          <Title text="Opciones de Menú" safe />

          {
            menuItems.map(item=>(
              <MenuItem key={item.component} {...item} />
            ))
          }
        </ScrollView>
      </View>
      
    </View>
  )
~~~

- Añado nuevas props a MenuItem para estilizar y agrupar los elementos
- Si es el primero o es el último voy a poder aplicar estilos condicionales

~~~js
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'
import  Icon  from 'react-native-vector-icons/Ionicons'

interface Props{
    name: string
    icon: string
    component?: string
    isFirst?: boolean
    isLast?: boolean
}

export const MenuItem = ({name, icon, component, isFirst= false, isLast= false }: Props) => {
  return (
        <Pressable
        onPress={()=>console.log('click')}
        >
            <View style={{
                ...styles.container,
                backgroundColor: colors.cardBackground,
                ...(isFirst && {borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10}),
                ...(isLast && {borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingTop: 10})
            }}>
                <Icon name={icon} size={25} style={{marginRight:10, color: colors.primary}} />
                <Text style={{color: colors.text}}>{name}</Text>
                <Icon name='chevron-forward-outline' size={25} style={{marginLeft: 'auto'}} color={colors.primary}/>

            </View>
        </Pressable>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  }
})
~~~

- Para que se apliquen los cambios tengo que indicar cual es el primero y cual es el último
- Para ello extraigo el index del map

~~~js
export const HomeScreen = () => {
  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.globalMargin}>
        <ScrollView>
          <Title text="Opciones de Menú" safe />

          {
            menuItems.map((item, index)=>(
              <MenuItem key={item.component} {...item}
              isFirst={index === 0 }
              isLast={index === menuItems.length -1}
              />
            ))
          }
        </ScrollView>
      </View>
      
    </View>
  )
}
~~~

- Vamos a separarlos por grupos

~~~js
const animationMenuItems = [
  {
    name: 'Animation 101',
    icon: 'cube-outline',
    component: 'Animation101Screen',
  },
  {
    name: 'Animation 102',
    icon: 'albums-outline',
    component: 'Animation102Screen',
  }
]

const menuItems= [
  {
    name: 'Pull to refresh',
    icon: 'refresh-outline',
    component: 'PullToRefreshScreen',
  },
  {
    name: 'Section List',
    icon: 'list-outline',
    component: 'CustomSectionListScreen',
  },
  {
    name: 'Modal',
    icon: 'copy-outline',
    component: 'ModalScreen',
  },
  {
    name: 'InfiniteScroll',
    icon: 'download-outline',
    component: 'InfiniteScrollScreen',
  },
  {
    name: 'Slides',
    icon: 'flower-outline',
    component: 'SlidesScreen',
  },
  {
    name: 'Themes',
    icon: 'flask-outline',
    component: 'ChangeThemeScreen',
  }
]

const uiMenuItems =[
  {
    name: 'Switches',
    icon: 'toggle-outline',
    component: 'SwitchScreen',
  },
  {
    name: 'Alerts',
    icon: 'alert-circle-outline',
    component: 'AlertScreen',
  },
  {
    name: 'TextInputs',
    icon: 'document-text-outline',
    component: 'TextInputScreen',
  }
]
~~~

- Hago los .map de los tres grupos dentro del ScrollView
- Lo coloco dentro de diferentes Views con un marginTop

~~~js
export const HomeScreen = () => {
  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.globalMargin}>
        <ScrollView>
          <Title text="Opciones de Menú" safe />


          {
            menuItems.map((item, index)=>(
              <MenuItem key={item.component} {...item}
              isFirst={index === 0 }
              isLast={index === menuItems.length -1}
              />
              ))
            }
            <View style={{marginTop: 10}}>
            {
              animationMenuItems.map((item, index)=>(
                <MenuItem key={item.component} {...item}
                isFirst={index === 0 }
              isLast={index === animationMenuItems.length -1} />
              ))
            }

            </View>

            <View style={{marginTop: 10}} >
            {
              uiMenuItems.map((item, index)=>(
                <MenuItem key={item.component} {...item}
                isFirst={index === 0 }
                isLast={index === uiMenuItems.length -1} />
              ))
            }
            </View>
        </ScrollView>
      </View>
      
    </View>
  )
}
~~~

- En MenuItem uso el useNavigation. Hay que configurar el RootStackParams para tener el tipado
- Lo dejo temporalmente tipado como any (dará error porque no hay rutas definidas)
- Coloco el componente en navigation.navigate dentro de la prop onPress del Pressable
----

## Animated API

- En las listas que he creado de menuItems en HomeScreen hay una de las propiedades que es component
- Uso el mismo nombre para nombrar a mis componentes en la carpeta components
- Vamos con las lista de animationMenuItems
- En animations/Animation101Screen.tsx creo un componente básico
- Lo añado en el StackNavigator

~~~js

const Stack = createStackNavigator();

export const StackNavigator =()=> {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Animation101Screen" component={Animation101Screen} />

    </Stack.Navigator>
  );
}
~~~

- Cuando quiero aplicar un cambio visual lo debo colocar en un estado 
- Si lo único que quiero es mantener el valor de una variable uso **useRef**
- Le paso una instancia de Animated donde el Value es 0.4 (algio translúcido, en este caso)
- Lo coloco en 0 porque quiero que la caja púrpura aparezca de la nada
- .current para tomar el valor actual
- este 0.4 no es de tipo number, es de tipo Animated.Value
- **No puedo** usar Animated properties **en un View** normal 
- Trabajaré con Animated.View (hay otros, como Animated.Image, etc)
- Le paso en el arreglo de styles un objeto con la propiedad **opacity** y le paso la referencia animatedOpacity
- Para el fadeIn, primero lo haremos en crudo, luego haremos un custom hook
   - Uso el objeto **Animated**, en este caso con la propiedad **timing** y le paso la referencia y el objeto de configuración:
    - A que valor quiero que vaya
    - La duración en milésimas de segundo
    - El tipo de aceleración (driver)
- Para disparar la animación uso .start
- Puedo colocar un callback dentro de start para disparar otra animación cuando esta animación termine

~~~js
import React, { useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'

export const Animation101Screen = () => {

  const animatedOpacity = useRef(new Animated.Value(0)).current

  const fadeIn = ()=>{
    Animated.timing(animatedOpacity,{
      toValue: 1,
      duration: 300, //ms
      useNativeDriver: true //acelerado por hardware
    }).start(()=>console.log("dispara esto cuando la animación termina"))
  }

  return (
    <View style={styles.container} >
        <Animated.View style={[
          styles.purpleBox, {
            opacity: animatedOpacity
          }]} />
        <Pressable onPress={fadeIn} style={{marginTop:10}} >
            <Text>FadeIn</Text>
        </Pressable>
        <Pressable onPress={()=> console.log('FadeOut')} style={{marginTop:10}} >
            <Text>FadeOut</Text>
        </Pressable>
    </View>
  )
}



import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  purpleBox:{
    backgroundColor: colors.primary,
    width: 150,
    height:150
  }
})
~~~

- El FadeOut es más de lo mismo!

~~~js
const fadeOut =()=>{
  Animated.timing(animatedOpacity,{
    toValue: 0,
    duration: 500,
    useNativeDriver: true
  }).start()
}
~~~
- Le paso la función al onPress
- Ahora quiero que la caja caiga y rebote
------

## Easing - Bounce

- Para animarlo que caiga, le paso una referencia con valor -100 y en la animación lo llevo a 0 usando la propiedad transform
- Uso un arreglo con un objeto dentro para indicarle la propiedad **translateY**
- Uso Easing para agregarle la propiedad elastic (hay varias). Con bounce rebota más
- En fadeOut uso .resetAnimation para devolverle el estado inicial
- La coloco en el callback para que lo haga cuando la animación terminó

~~~js
import React, { useRef } from 'react'
import { Animated, Easing, Pressable, Text, View } from 'react-native'

export const Animation101Screen = () => {

  const animatedOpacity = useRef(new Animated.Value(0)).current

  const animatedTop = useRef(new Animated.Value(-100)).current

  const fadeIn = ()=>{

    Animated.timing(animatedTop, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
      //easing: Easing.elastic(1)
      easing: Easing.bounce
    }).start()

    Animated.timing(animatedOpacity,{
      toValue: 1,
      duration: 300, //ms
      useNativeDriver: true //acelerado por hardware
    }).start()
  }

  const fadeOut =()=>{
    Animated.timing(animatedOpacity,{
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(()=>animatedTop.resetAnimation())

    

  }

  return (
    <View style={styles.container} >
        <Animated.View style={[
          styles.purpleBox, {
            opacity: animatedOpacity,
            transform:[{
              translateY: animatedTop,
            }]
          }]} />
        <Pressable onPress={fadeIn} style={{marginTop:10}} >
            <Text>FadeIn</Text>
        </Pressable>
        <Pressable onPress={fadeOut} style={{marginTop:10}} >
            <Text>FadeOut</Text>
        </Pressable>
    </View>
  )
}



import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  purpleBox:{
    backgroundColor: colors.primary,
    width: 150,
    height:150
  }
})
~~~

- Hay mucha lógica aquí, hay sobrecarga. Vamos a crear un hook para customizar las animaciones y quede más limpio
-----

## CustomHook useAnimation

- En hooks/useAnimation.tsx
- Empiezo por copiar todo el código relacionado con las animaciones al hook
- Cambio el valor de animatedTop a 0 porque la cambiaré manualmente
- Quedaría algo así

~~~js
import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

export const useAnimation = () => {

    const animatedOpacity = useRef(new Animated.Value(0)).current

    const animatedTop = useRef(new Animated.Value(0)).current
  
    const fadeIn = ()=>{
  
      Animated.timing(animatedTop, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        //easing: Easing.elastic(1)
        easing: Easing.bounce
      }).start()
  
      Animated.timing(animatedOpacity,{
        toValue: 1,
        duration: 300, //ms
        useNativeDriver: true //acelerado por hardware
      }).start()
    }
  
    const fadeOut =()=>{
      Animated.timing(animatedOpacity,{
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(()=>animatedTop.resetAnimation())
    }
    
    return {
        fadeIn,
        fadeOut
    }   
}
~~~

- El fadeIn solo debería encargarse del fadeIn por lo que el animatedTop lo comento momentáneamente
- Para hacer los valores reutilizables le indico a fadeIn que recibirá un objeto con la duración.
  - Le coloco un valor por defecto de 400
  - Hago lo mismo con toValue

~~~js
import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'

export const useAnimation = () => {

    const animatedOpacity = useRef(new Animated.Value(0)).current

    const animatedTop = useRef(new Animated.Value(0)).current
  
    const fadeIn = ({duration= 400, toValue=1, callback= ()=>{}})=>{
  
      /*Animated.timing(animatedTop, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        //easing: Easing.elastic(1)
        easing: Easing.bounce
      }).start()*/
  
      Animated.timing(animatedOpacity,{
        toValue,
        duration, 
        useNativeDriver: true 
      }).start(callback)
    }
  
    const fadeOut =({toValue=0, duration=400, callback=()=>{}})=>{
      Animated.timing(animatedOpacity,{
        toValue,
        duration,
        useNativeDriver: true
      }).start(callback)
    }
    
    return {
        animatedTop,
        animatedOpacity,
        fadeIn,
        fadeOut
    } 
}
~~~

- Desestructuro del hook las funciones y valores
- Ahora en el onPress me pide que los llame con un callback y debo pasarle aunque sea un objeto vacío

~~~js
import React, { useRef } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'

export const Animation101Screen = () => {


  const {fadeIn, fadeOut, animatedTop, animatedOpacity}= useAnimation()


 

  return (
    <View style={styles.container} >
        <Animated.View style={[
          styles.purpleBox, {
            opacity: animatedOpacity,
            transform:[{
              translateY: animatedTop,
            }]
          }]} />
        <Pressable onPress={()=>fadeIn({})} style={{marginTop:10}} >
            <Text>FadeIn</Text>
        </Pressable>
        <Pressable onPress={()=>fadeOut({})} style={{marginTop:10}} >
            <Text>FadeOut</Text>
        </Pressable>
    </View>
  )
}
~~~

- Falta el movimiento

~~~js
const startMovingTopPosition =({initialPosition= 0, toValue=0, duration=700, easing= Easing.linear, callback=()=>{}})=>{
    animatedTop.setValue(initialPosition)
    Animated.timing(animatedTop, {
        toValue,
        duration,
        useNativeDriver: true,
        //easing: Easing.elastic(1)
        easing
    }).start(callback)      
}
~~~

- Lo incluyo en el return del hook y lo desestructuro en Animation101Screen
- Ahora debo hacer una combinación
- En el cuerpo de la función del onPress (donde el fadeIn) pongo las dos animaciones (podría hacerlo en una función y pasarle la función) 

~~~js
import React, { useRef } from 'react'
import { Animated, Easing, Pressable, Text, View } from 'react-native'

export const Animation101Screen = () => {


  const {fadeIn, fadeOut, animatedTop, animatedOpacity, startMovingTopPosition}= useAnimation()


 

  return (
    <View style={styles.container} >
        <Animated.View style={[
          styles.purpleBox, {
            opacity: animatedOpacity,
            transform:[{
              translateY: animatedTop,
            }]
          }]} />

        <Pressable onPress={()=>{
          fadeIn({})
          startMovingTopPosition({initialPosition:-100, easing: Easing.bounce, duration:750})
        }} style={{marginTop:10}}>
            <Text>FadeIn</Text>
        </Pressable>

        <Pressable onPress={()=>fadeOut({})} style={{marginTop:10}} >
            <Text>FadeOut</Text>
        </Pressable>
    </View>
  )
}
~~~
------

## Animated ValueXY

- Creo animations/Animation102Screen
- Lo coloco en el StackNavigator
- Uso la documentación oficial para recrear este botón arrastrable
- La propiedad useNativeDriver hay que ponerla en false
- Dice que necesita un segundo argumento, en Animated.event

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
    ], {useNativeDriver: false}),  //aqui coloco el segundo argumento
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

- Lo coloco en Animation102Screen. Le añado unos estilos al View para que me quede en el centro

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import DraggableView from '../../components/Draggable'

export const Animation102Screen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}} >
      <DraggableView />
    </View>
  )
}
~~~
---------

## Componentes Personalizados

- Creo switches/SwitchesScreen.tsx, lo coloco en el StackNavigator
- Creo components/ui/CustomView.tsx
- En el styles del View coloco un arreglo dentro del objeto
- **NOTA**: para hacer la interfaz y saber el tipo de style, puedo escribirla (backgroundColor: 'black') y colocar el cursor encima
- Como le voy a colocar elementos dentro debo definir el children en las Props
- Uso el CustomView en la pantalla de switchesScreen

~~~js
import React, { ReactNode } from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { globalStyles } from '../../../config/theme/theme'

interface Props{
    style?: StyleProp<ViewStyle>
    children?: ReactNode 
}


export const CustomView = ({style, children}: Props) => {
  return (
    <View style={[globalStyles.mainContainer, style]} >
      {children}
    </View>
  )
}
~~~

- Puedo heredar de la inetrfaz PropsWithChildren cuando voy a colocar children

~~~js
import React, { PropsWithChildren, ReactNode } from 'react'
import { ImageBackgroundComponent, StyleProp, Text, View, ViewStyle } from 'react-native'
import { colors } from '../../../config/theme/theme'

interface Props extends PropsWithChildren{
    style?: StyleProp<ViewStyle>   
}

export const Card  = ({style, children}: Props) => {
  return (
    <View style={[
      {backgroundColor: colors.cardBackground,
      borderRadius: 10,
    padding: 10},
    style
    ]}>
      {children}
    </View>
  )
}
~~~

- La coloco en SwitchScreen

~~~js
import React from 'react'
import { Text} from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Card } from '../../components/ui/Card'

export const SwitchScreen = () => {
  return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
        <Text>Component</Text>
        </Card>
    </CustomView>
    
  )
}
~~~

- Creo un Button customizable también
- En el style del Pressable utilizo una función para saber cuando está presionado.
  - Abro paréntesis para hacer implícito el return, y llaves cuadradas 

~~~js
import React from 'react'
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native'
import { colors, globalStyles } from '../../../config/theme/theme'

interface Props{
    text: string
    styles?: StyleProp<ViewStyle>
    onPress: ()=>void
}

export const Button = ({text, styles, onPress}: Props) => {
  return (
    <Pressable
        onPress={onPress}
        style={(pressed)=>([
            globalStyles.btnPrimary,
            {
                opacity: pressed? 0.8 : 1,
                backgroundColor: colors.primary
            },
            styles
        ])}
    >
        <Text style={[
            globalStyles.btnPrimaryText,
            {
                color: colors.buttonTextColor
            }
        ]} >
          {text}
        </Text>
    </Pressable>
  )
}
~~~

- Lo coloco en SwitchScreen

~~~js
import React from 'react'
import { Text} from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export const SwitchScreen = () => {
  return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
        <Text>Component</Text>
        </Card>
        <Button text="Click me!" onPress={()=>{}} />
    </CustomView>
    
  )
}
~~~

- Ahora que todo funciona, dejo el CustomView vacío en el SwitchScreen
------

## Componente Switch

- Copio el código de la documentación, con los states incluidos

~~~js
import React, { useState } from 'react'
import { Switch, Text} from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Card } from '../../components/ui/Card'


export const SwitchScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)
  return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
        <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
        </Card>
    </CustomView>   
  )
}
~~~

- En ios aparece a la izquierda, no como en Android
- Luego lo arreglaremos
- Este switch no está aplicando el tema de material 3. Después usaremos un componente especializado.
- Creo un custom switch

~~~js
import React from 'react'
import { Switch } from 'react-native-gesture-handler'
import { Platform, Text, View } from 'react-native'

interface Props{
    isOn: boolean
    text?: string
    onChange: (value: boolean) => void
}


export const CustomSwitch = ({isOn, text, onChange}: Props) => {
  return (
    <View style={styles.switchRow}>
        {
            text && <Text style={{color: colors.text}}>{text}</Text>
        }
      
        <Switch
            thumbColor={Platform.OS === 'android'? colors.primary: ""}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={isOn}
            />
    </View>
  )
}


import {StyleSheet} from 'react-native'
import { colors } from '../../../config/theme/theme'

const styles = StyleSheet.create({
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    }
})
~~~

- Lo renderizo en SwitchScreen pasándole las props

~~~js
import React, { useState } from 'react'
import { Switch, Text} from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Card } from '../../components/ui/Card'
import { CustomSwitch } from '../../components/ui/Switch'


export const SwitchScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)
  return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
          <CustomSwitch isOn={isEnabled} onChange={toggleSwitch} text="Encendido" />
 
        </Card>
    </CustomView>
    
  )
}
~~~

- Podemos implementar que en cualquier lado donde presione de la area de la card active el toggle
- O que si no viene el texto los elementos estén al final
- Hago una refactorización en SwitchScreen

~~~js
import React, { useState } from 'react'
import { Switch, Text} from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Card } from '../../components/ui/Card'
import { CustomSwitch } from '../../components/ui/Switch'


export const SwitchScreen = () => {

   const [state, setState]= useState({
    isActive: true,
    isHungry: false,
    isHappy: true
   })


  return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
          <CustomSwitch isOn={state.isActive} 
          onChange={(value)=> setState({...state, isActive: value})} 
          text="Active" />
          <CustomSwitch isOn={state.isHungry} 
          onChange={(value)=> setState({...state, isHungry: value})} 
          text="Humgry" />
          <CustomSwitch isOn={state.isHappy} 
          onChange={(value)=> setState({...state, isHappy: value})} 
          text="Happy" />
 
        </Card>
    </CustomView>   
  )
}
~~~
------

## Componente Separador

- Creo components/ui/Separator.tsx

~~~js
import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { colors, globalStyles } from '../../../config/theme/theme'

interface Props{
    style?: StyleProp<ViewStyle>
}

export const Separator = ({style}: Props) => {

  return (
    <View style={[
        {
            alignSelf: 'center',
            width: '80%',
            height: 1,
            backgroundColor: colors.text,
            opacity: 0.1,
            marginVertical: 8
        },
        style
    ]}>
      <Text>Separator</Text>
    </View>
  )
}
~~~

- Coloco uno entre cada switch

~~~js
return (
    <CustomView style={{marginTop: 10, paddingHorizontal: 10}} >
        <Card>
          <CustomSwitch isOn={state.isActive} 
          onChange={(value)=> setState({...state, isActive: value})} 
          text="Active" />
          <Separator />
          <CustomSwitch isOn={state.isHungry} 
          onChange={(value)=> setState({...state, isHungry: value})} 
          text="Humgry" />
          <Separator />
          <CustomSwitch isOn={state.isHappy} 
          onChange={(value)=> setState({...state, isHappy: value})} 
          text="Happy" />
        </Card>
    </CustomView> 
  )
~~~

- Coloquémonos enmedio de los items en HomeScreen
- En MenuItem coloco el return en un Fragment para colocar el Separator después del Pressable
- Pregunto si es el último para no colocarlo después

~~~js
    <>
        <Pressable
        onPress={()=>navigation.navigate(component)}
        >
            <View style={{
                ...styles.container,
                backgroundColor: colors.cardBackground,
                ...(isFirst && {borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10}),
                ...(isLast && {borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingTop: 10})
            }}>
                <Icon name={icon} size={25} style={{marginRight:10, color: colors.primary}} />
                <Text style={{color: colors.text}}>{name}</Text>
                <Icon name='chevron-forward-outline' size={25} style={{marginLeft: 'auto'}} color={colors.primary}/>

            </View>
        </Pressable>
            
            {!isLast && <Separator />}
    </>
~~~

- de esta manera no queda muy bien la presentación en el Home, refactorizo el separador, meto el view en otro view y le añado el backgroundColor de la card

~~~js
import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { colors, globalStyles } from '../../../config/theme/theme'

interface Props{
    style?: StyleProp<ViewStyle>
}

export const Separator = ({style}: Props) => {

  return (
    <View style={{backgroundColor: colors.cardBackground}} >
        <View style={[
            {
                alignSelf: 'center',
                width: '80%',
                height: 1,
                backgroundColor: colors.text,
                opacity: 0.1,
                marginVertical: 8
            },
            style
        ]}>
  
        </View>

    </View>
  )
}
~~~
----------

## Component Alert

- Creo AlertScreen y lo coloco en el StackNavigator con ese nombre, igual que en el arreglo de MenuItems
- Copio la documentación dentro de mi CustomView
- Creo el cascarón con los botones (mi CustomButton)
- Coloco un View con un high para poner distancia entre ellos

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { globalStyles } from '../../../config/theme/theme'
import { Button } from '../../components/ui/Button'

export const AlertScreen = () => {
  return (
    <CustomView style={globalStyles.globalMargin}>
      <Title safe text="Alertas" />

      <Button text="Alerta - 2 botones" onPress={()=>{}} />

      <View style={{height: 10}} />

      <Button text="Alerta - 3 botones" onPress={()=>{}} />
      
      <View style={{height: 10}} />

      <Button text="Prompt - Input" onPress={()=>{}} />
    </CustomView>
  )
}
~~~

- Copio las funciones de la documentación y las coloco en el cuerpo del Functional Component
- Las uso en el onPress

~~~js
import React from 'react'
import { Alert, Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { globalStyles } from '../../../config/theme/theme'
import { Button } from '../../components/ui/Button'

export const AlertScreen = () => {
    const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const createThreeButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  return (
    <CustomView style={globalStyles.globalMargin}>
      <Title safe text="Alertas" />

      <Button text="Alerta - 2 botones" onPress={createTwoButtonAlert} />

      <View style={{height: 10}} />

      <Button text="Alerta - 3 botones" onPress={createThreeButtonAlert} />
      
      <View style={{height: 10}} />

      <Button text="Prompt - Input" onPress={()=>{}} />
    </CustomView>
  )
}
~~~

- Las alertas se ven en plan Material 2
- No hay mucha personalización estética
- En el onPress de la Alert puedo disparar una acción
- Algunas de las opciones de configuración que colocaría en un segundo objeto funcionan en android y no en ios y al revés

~~~js
const createTwoButtonAlert = () =>
Alert.alert('Alert Title', 'My Alert Msg', [
  {
    text: 'Cancel',
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel',
  },
  {text: 'OK', onPress: () => console.log('OK Pressed')},
  
],
{cancelable: true,
onDismiss(){
    console.log('onDismiss')
}}
);
~~~
----

## Component Alert Prompt

~~~js
const showPrompt = () =>{
    Alert.prompt('¿Cual es tu correo electrónico?','Texto blablablabla',
    (value: string)=> console.log({value})
    )
}
~~~

- Uso el showPrompt en el onPress
- En Android no funciona (en ios si)
- En ios puedo hacer que el input aparezca encriptado, añadirle un valor por defecto, y que saque el teclado numérico de esta manera

~~~js
const showPrompt = () =>{
    Alert.prompt(
        '¿Cual es tu correo electrónico?',
        'Texto blablablabla',
        (value: string)=> console.log({value}),
        'secure-text',
        'Soy el valor por defecto',
        'number-pad'
    )
}
~~~
----

## Prompt ios y Android

- Instalo el paquete (no es el paquete más actualizado del mundo)

> react-native-prompt-android

- Ya no hace falta hacer el link manual
- Copio el ejemplo de la documentación

~~~js
import prompt from 'react-native-prompt-android';

    const showPrompt = () =>{
      prompt(
        'Enter password',
        'Enter your password to claim your $1.5B in lottery winnings',
        [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {text: 'OK', onPress: password => console.log('OK Pressed, password: ' + password)},
        ],
        {
            type: 'secure-text',
            cancelable: false,
            defaultValue: 'test',
            placeholder: 'placeholder'
        }
    ); 
   }
~~~

- Con paquetes de terceros debo usar el patrón adaptador
- En config/adapters/prompt.adapter.ts

~~~js
import prompt from "react-native-prompt-android";


interface Options{
    title: string
    subTitle?: string
    buttons: PromptButton[]
    promptType?: 'default' | 'plain-text' | 'secure-text'
    placeholder?: string
    defaultValue?: string
}

interface PromptButton{
    text: string
    onPress: ()=> void
    style?: "cancel" | "default" | "destructive"
}

export  const showPrompt = ({title, subTitle, buttons, promptType, placeholder, defaultValue}:Options) =>{
    prompt(
      title,
      subTitle,
      buttons,
      
      {
          type: promptType= 'plain-text', //plain-text por defecto para que se muestre también en ios
          cancelable: false,
          defaultValue,
          placeholder
      }
  ); 
 }
~~~

- Cambio el nombre del método que tenía por onShowPrompt
- En AlertScreen

~~~js
const onShowPrompt = () =>{
  showPrompt({title:"Titulo", 
  subTitle:"Subtitulo",
  buttons: [
    {text: 'OK', onPress:()=>console.log('button OK')},
    {text: 'Cancel', onPress:()=>console.log('button Cancel')}
  ],
  placeholder: 'PlaceHolder'
  })
}
~~~

- De esta manera solo hay que cambiar la implementación y no todas las pantallas donde se consuma el prompt
- 
------

## Componente TextInput

- Creo screens/inputs/textInputScreen. Lo coloco en el StackNavigator
- Como todo el rato estoy colocando el globalStyles.marginCntainer en el CustomView lo añado como una prop al componente
- Si el margin está en true añada el estilo

~~~js
import React, { ReactNode } from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { globalStyles } from '../../../config/theme/theme'

interface Props{
    style?: StyleProp<ViewStyle>
    children?: ReactNode 
    margin?: boolean
}


export const CustomView = ({margin = false, style, children}: Props) => {
  return (
    <View style={[
      margin ? globalStyles.mainContainer: null, 
      style]} >
      {children}
    </View>
  )
}
~~~

- Al poner el TextInput dentro de mi custom Card hace que se vea bonito

~~~js
import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'

export const TextInputScreen = () => {
  return (
    <CustomView margin>
      <Title text="text Inputs" safe />
      <Card>
        <TextInput/>
      </Card>
    </CustomView>
  )
}
~~~

- Defino un estilo de CSS desde el theme global
- El color del texto al cambiarlo de manera dinámica me dará un inconveniente más adelante. Lo solucionaremos

~~~js
  input:{
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    color: colors.text
  }
~~~

- Hay varias properties en TextInput
  - autoCapitalize no es un valor booleano, indico si quiero capitalizar por palabras, sentencias...

~~~js
import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'
import { globalStyles } from '../../../config/theme/theme'

export const TextInputScreen = () => {

    const [form, setForm] = useState({
        name: '',
        email:'',
        phone: ''
    })

  return (
    <CustomView margin>
      <Title text="Text Input" safe />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Nombre completo"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, name: value})}
        />
      </Card>

      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Email"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, email: value})}
        />
      </Card>
      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Teléfono"
            autoCapitalize='words'
            keyboardType='phone-pad'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, phone: value})}
        />
      </Card>
      <View style={{height: 10}} />

        <Card>
            <Text>{JSON.stringify(form, null, 2)}</Text>
        </Card>
    </CustomView>
  )
}
~~~

- Ahora hay un problema y es que si tuviera varios objetos que leer en pantalla, no podría hacer scroll
- Meto todo el contenido dentro de un ScrollView
-----

## Scroll y teclado

- Si coloco un TextInput al final, al aparecer el teclado en Android si lo desplaza hacia arriba pero en ios no
- En ios es necesario envolver el componente dentro de un KeyboradAvoidingView~para que el teclado en pantalla no de problemas
- También es recomendable poner un View con un margin de gracia al final

~~~js
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'
import { globalStyles } from '../../../config/theme/theme'

export const TextInputScreen = () => {

    const [form, setForm] = useState({
        name: '',
        email:'',
        phone: ''
    })

  return (

    <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'padding': undefined}>
    <ScrollView>

    <CustomView margin>
      <Title text="Text Input" safe />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Nombre completo"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, name: value})}
        />
      </Card>

      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Email"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, email: value})}
        />
      </Card>
      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Teléfono"
            autoCapitalize='words'
            keyboardType='phone-pad'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, phone: value})}
        />
      </Card>
      <View style={{height: 10}} />

        <Card>
            <Text>{JSON.stringify(form, null, 2)}</Text>
        </Card>
        <View style={{height: 20}} />
    </CustomView>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}
~~~
----

## Pull To Refresh

- Creo screens/ui/PullToRefreshScreen. Lo coloco en el StackNavigator
- RefreshControl pide ciertas properties obligatorias
- Con el refreshing en true, en ios el notch cubre el spinning
- Para arreglarlo uso el safeAreaInsets y extraigo el top, lo coloco en progressViewOffset
- Cambio el true en duro por un state
- En onRefresh llamo a la función que he creado
- Le puedo pasar un arreglo de colores en hexadecimal
- Para que se vea bien en ios le paso el globalStyles al ScrollView

~~~js
import React, { useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { Title } from '../../components/ui/Title'
import { CustomView } from '../../components/ui/CustomView'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, globalStyles } from '../../../config/theme/theme'

export const PullToRefreshScreen = () => {

    const [isRefreshing, setIsRefreshing] = useState(false)

    const {top} = useSafeAreaInsets()
    
    const onRefresh =()=>{
        setIsRefreshing(true)

        setTimeout(()=>{
            setIsRefreshing(false)
        }, 2000)
    }

  return (
    <ScrollView refreshControl={
    <RefreshControl 
        refreshing={isRefreshing}
        progressViewOffset={top}
        onRefresh={onRefresh} 
        colors={[colors.primary, 'red', 'orange', 'green']} />} 
        style={[globalStyles.mainContainer, globalStyles.globalMargin]}
        >
        <CustomView margin>
            <Title text="Pull To Refresh" safe  />
        </CustomView>
    </ScrollView>
  )
}
~~~

- Ahora si tiro de la pantalla aparece un spinning
- Podríamos crear un CustomScrollView para que quedara esta configuración siempre y no estar colocando esto una y otra vez
-----

## Componente - SectionList

- Copio la data del Gist para mostrar en el SectionList

> https://gist.githubusercontent.com/Klerith/62fc1759bbb686446caf22a04956d47e/raw/fdb7dc53c1385a5eeaf92ce2a7c53ddd1ba3c27a/characters.ts

~~~js
interface Houses {
  title: string;
  data: string[];
}

const houses: Houses[] = [
  {
    title: 'DC Comics',
    data: [
      'Superman',
      'Batman',
      'Wonder Woman (Mujer Maravilla)',
      'The Flash (Flash)',
      'Aquaman',
      'Green Lantern (Linterna Verde)',
      'Cyborg',
      'Shazam',
      'Green Arrow (Flecha Verde)',
      'Batgirl (Batichica)',
      'Nightwing (Ala Nocturna)',
      'Supergirl',
      'Martian Manhunter (Detective Marciano)',
      'Harley Quinn',
      'Joker',
      'Catwoman (Gata Salvaje)',
      'Lex Luthor',
      'Poison Ivy (Hiedra Venenosa)',
      'Robin',
      'Deathstroke (Deathstroke el Terminator)',
    ],
  },
  {
    title: 'Marvel Comics',
    data: [
      'Spider-Man (Hombre Araña)',
      'Iron Man (Hombre de Hierro)',
      'Captain America (Capitán América)',
      'Thor',
      'Black Widow (Viuda Negra)',
      'Hulk',
      'Doctor Strange (Doctor Extraño)',
      'Black Panther (Pantera Negra)',
      'Captain Marvel (Capitana Marvel)',
      'Wolverine',
      'Deadpool',
      'Scarlet Witch (Bruja Escarlata)',
      'Ant-Man (Hombre Hormiga)',
      'Wasp (Avispa)',
      'Groot',
      'Rocket Raccoon (Mapache Cohete)',
      'Gamora',
      'Drax the Destroyer (Drax el Destructor)',
    ],
  },
  {
    title: 'Anime',
    data: [
      'Son Goku (Dragon Ball)',
      'Naruto Uzumaki (Naruto)',
      'Monkey D. Luffy (One Piece)',
      'Sailor Moon (Sailor Moon)',
      'Kenshin Himura (Rurouni Kenshin)',
      'Edward Elric (Fullmetal Alchemist)',
      'Inuyasha (Inuyasha)',
      'Sakura Kinomoto (Cardcaptor Sakura)',
      'Light Yagami (Death Note)',
      'Eren Yeager (Attack on Titan)',
      'Lelouch Lamperouge (Code Geass)',
      'Vegeta (Dragon Ball)',
      'Ichigo Kurosaki (Bleach)',
      'Kaneki Ken (Tokyo Ghoul)',
      'Gon Freecss (Hunter x Hunter)',
      'Asuka Langley Soryu (Neon Genesis Evangelion)',
      'Saitama (One Punch Man)',
      'Mikasa Ackerman (Attack on Titan)',
      'Natsu Dragneel (Fairy Tail)',
      'Usagi Tsukino (Sailor Moon)',
      'Sasuke Uchiha (Naruto)',
    ],
  },
];
~~~

- Creo en screens/ui/CustomSectionListScreen, lo coloco en el StackNavigator
- Coloco mi CustomVIew, coloco un Title y el SectionList que tiene autocierre
  - Me pidelas props sections, keyExtractor y uso renderItem para renderizar cada elemento (puedo extraer tambien el index si lo necesito)

~~~js
import React from 'react'
import { SectionList, Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'

interface Houses {
    title: string;
    data: string[];
  }
  
  const houses: Houses[] = [
    {
      title: 'DC Comics',
      data: [
        'Superman',
        'Batman',
        'Wonder Woman (Mujer Maravilla)',
        'The Flash (Flash)',
        'Aquaman',
        'Green Lantern (Linterna Verde)',
        'Cyborg',
        'Shazam',
        'Green Arrow (Flecha Verde)',
        'Batgirl (Batichica)',
        'Nightwing (Ala Nocturna)',
        'Supergirl',
        'Martian Manhunter (Detective Marciano)',
        'Harley Quinn',
        'Joker',
        'Catwoman (Gata Salvaje)',
        'Lex Luthor',
        'Poison Ivy (Hiedra Venenosa)',
        'Robin',
        'Deathstroke (Deathstroke el Terminator)',
      ],
    },
    {
      title: 'Marvel Comics',
      data: [
        'Spider-Man (Hombre Araña)',
        'Iron Man (Hombre de Hierro)',
        'Captain America (Capitán América)',
        'Thor',
        'Black Widow (Viuda Negra)',
        'Hulk',
        'Doctor Strange (Doctor Extraño)',
        'Black Panther (Pantera Negra)',
        'Captain Marvel (Capitana Marvel)',
        'Wolverine',
        'Deadpool',
        'Scarlet Witch (Bruja Escarlata)',
        'Ant-Man (Hombre Hormiga)',
        'Wasp (Avispa)',
        'Groot',
        'Rocket Raccoon (Mapache Cohete)',
        'Gamora',
        'Drax the Destroyer (Drax el Destructor)',
      ],
    },
    {
      title: 'Anime',
      data: [
        'Son Goku (Dragon Ball)',
        'Naruto Uzumaki (Naruto)',
        'Monkey D. Luffy (One Piece)',
        'Sailor Moon (Sailor Moon)',
        'Kenshin Himura (Rurouni Kenshin)',
        'Edward Elric (Fullmetal Alchemist)',
        'Inuyasha (Inuyasha)',
        'Sakura Kinomoto (Cardcaptor Sakura)',
        'Light Yagami (Death Note)',
        'Eren Yeager (Attack on Titan)',
        'Lelouch Lamperouge (Code Geass)',
        'Vegeta (Dragon Ball)',
        'Ichigo Kurosaki (Bleach)',
        'Kaneki Ken (Tokyo Ghoul)',
        'Gon Freecss (Hunter x Hunter)',
        'Asuka Langley Soryu (Neon Genesis Evangelion)',
        'Saitama (One Punch Man)',
        'Mikasa Ackerman (Attack on Titan)',
        'Natsu Dragneel (Fairy Tail)',
        'Usagi Tsukino (Sailor Moon)',
        'Sasuke Uchiha (Naruto)',
      ],
    },
  ];

export const CustomSectionListScreen = () => {
  return (
    <CustomView>
        <Title text="Lista de personajes" />

        <Card>
            <SectionList 
                sections={houses}
                keyExtractor={item=> item}
                renderItem={({item})=> <Text style={{marginVertical: 2}} >{item}</Text>}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({section})=><Text style={{fontWeight: '500', fontSize: 20, marginVertical: 10}} >{section.title} </Text>}
            />
        </Card>
    </CustomView>
  )
}
~~~

- Me creo un componente para renderizar en el renderSectionHeader

~~~js
import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '../../../config/theme/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { globalStyles } from '../../../config/theme/theme'

interface Props{
    text: string
    safe?: boolean
    backgroundColor?: string
}

export const SubTitle = ({text, safe= false, backgroundColor= colors.background}: Props) => {

    const {top} = useSafeAreaInsets()
  
    return (
    
      <Text style={{
            ...globalStyles.subTitle,
            marginTop: safe? top: 0,
            marginBottom: 10,
            backgroundColor
      }}>{text}</Text>
    
  )
}
~~~

- Renderizo Subtitle en el renderSectionHeader del SectionList

~~~js
<Card>
    <SectionList 
        sections={houses}
        keyExtractor={item=> item}
        renderItem={({item})=> <Text style={{marginVertical: 2}} >{item}</Text>}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({section})=> <SubTitle  safe text={section.title} />} 
        stickySectionHeadersEnabled 
        SectionSeparatorComponent={ Separator}
        ListHeaderComponent={()=> <Title text="Personajes" />}
        ListFooterComponent={()=> <Title text={`Secciones:  ${houses.length}`} />}
    />
</Card>
~~~

- Si no especifico un tamaño del dispositivo voy a disponer de todo el dispositivo
- En el style puedo especificar un height para que ocupe la mitad de la pantalla con un 500
- Ahora solo debería sacar las dimensiones del dispositivo con useDimensions, restar el top

~~~js

import React from 'react'
import { SectionList, Text, View, useWindowDimensions } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'
import { SubTitle } from '../../components/ui/Subtitle'
import { Separator } from '../../components/ui/Separator'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Houses {
    title: string;
    data: string[];
  }
  
  const houses: Houses[] = [
    {
      title: 'DC Comics',
      data: [
        'Superman',
        'Batman',
        'Wonder Woman (Mujer Maravilla)',
        'The Flash (Flash)',
        'Aquaman',
        'Green Lantern (Linterna Verde)',
        'Cyborg',
        'Shazam',
        'Green Arrow (Flecha Verde)',
        'Batgirl (Batichica)',
        'Nightwing (Ala Nocturna)',
        'Supergirl',
        'Martian Manhunter (Detective Marciano)',
        'Harley Quinn',
        'Joker',
        'Catwoman (Gata Salvaje)',
        'Lex Luthor',
        'Poison Ivy (Hiedra Venenosa)',
        'Robin',
        'Deathstroke (Deathstroke el Terminator)',
      ],
    },
    {
      title: 'Marvel Comics',
      data: [
        'Spider-Man (Hombre Araña)',
        'Iron Man (Hombre de Hierro)',
        'Captain America (Capitán América)',
        'Thor',
        'Black Widow (Viuda Negra)',
        'Hulk',
        'Doctor Strange (Doctor Extraño)',
        'Black Panther (Pantera Negra)',
        'Captain Marvel (Capitana Marvel)',
        'Wolverine',
        'Deadpool',
        'Scarlet Witch (Bruja Escarlata)',
        'Ant-Man (Hombre Hormiga)',
        'Wasp (Avispa)',
        'Groot',
        'Rocket Raccoon (Mapache Cohete)',
        'Gamora',
        'Drax the Destroyer (Drax el Destructor)',
      ],
    },
    {
      title: 'Anime',
      data: [
        'Son Goku (Dragon Ball)',
        'Naruto Uzumaki (Naruto)',
        'Monkey D. Luffy (One Piece)',
        'Sailor Moon (Sailor Moon)',
        'Kenshin Himura (Rurouni Kenshin)',
        'Edward Elric (Fullmetal Alchemist)',
        'Inuyasha (Inuyasha)',
        'Sakura Kinomoto (Cardcaptor Sakura)',
        'Light Yagami (Death Note)',
        'Eren Yeager (Attack on Titan)',
        'Lelouch Lamperouge (Code Geass)',
        'Vegeta (Dragon Ball)',
        'Ichigo Kurosaki (Bleach)',
        'Kaneki Ken (Tokyo Ghoul)',
        'Gon Freecss (Hunter x Hunter)',
        'Asuka Langley Soryu (Neon Genesis Evangelion)',
        'Saitama (One Punch Man)',
        'Mikasa Ackerman (Attack on Titan)',
        'Natsu Dragneel (Fairy Tail)',
        'Usagi Tsukino (Sailor Moon)',
        'Sasuke Uchiha (Naruto)',
      ],
    },
  ];

export const CustomSectionListScreen = () => {

  const {height} = useWindowDimensions()

  const {top} = useSafeAreaInsets()

  return (
    <CustomView>
        <Title text="Lista de personajes" />

        <Card>
            <SectionList 
                sections={houses}
                keyExtractor={item=> item}
                renderItem={({item})=> <Text style={{marginVertical: 2}} >{item}</Text>}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({section})=> <SubTitle  safe text={section.title} />} 
                stickySectionHeadersEnabled 
                SectionSeparatorComponent={ Separator}
                ListHeaderComponent={()=> <Title text="Personajes" />}
                ListFooterComponent={()=> <Title text={`Secciones:  ${houses.length}`} /> }
                style={{
                  height: height - top - 120
                }} 
            />
        </Card>
    </CustomView>
  )
}
~~~
-----

## Modal

- Creo screens/ui/ModalScreen. Lo coloco en el StackNavigator
- Tenemos un Modal en componentes de React Native pero vamos a hacer algo distinto
- Si le coloco la propiedad visible en false se deja de ver el modal
- Manejarlo con un state es básicamente todo

~~~js
import React from 'react'
import { Modal, Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'

export const ModalScreen = () => {
  return (
    <CustomView>
      <Title text="Modal" />

      <Modal visible={false}>
        <View>
          <Title text="Modal Content" />
        </View>
      </Modal>
    </CustomView>
  )
}
~~~
------

## InfiniteScroll

- Creo el componente, lo coloco en el StackNavigator
- Hagamos un ejercicio sencillo
- Creo un estado para guardar los números
- Usualmente vamos a querer usar un FlatList para hacer un InfiniteScroll, ya que carga de manera perezosa
- Con un ScrollView todos los elementos van a ser cargados desde el inicio
- EL FlatList tiene la propiedad onEndReached para disparar una función cuando llega al final
- Uso el setstate, esparzo el state anterior y el nuevo Array

~~~js
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { colors } from '../../../config/theme/theme'
import { FlatList } from 'react-native-gesture-handler'

export const InfiniteScroll = () => {

    const [numbers, setNumbers] = useState([0,1,2,3,4,5])

    const loadMore =()=>{
        const newArray = Array.from({length: 5}, (_,i)=>numbers.length +i)
        setNumbers([...numbers, ...newArray])
    }


  return (
    <CustomView margin>
      <Title text="InfiniteScroll" />
      <FlatList
        onEndReached={loadMore}
        data={numbers}
        renderItem={({item}: any)=>(
            <Text style={{height: 300, backgroundColor: colors.primary, color: 'white', fontSize: 50}}>{item}</Text>
        )}
        
        />
    </CustomView>
  )
}
~~~

- Para evitar el trompicón y cargar los elementos antes de que llegue al final tengo la proponEndReachedTreshold, cuyo valor por defecto es 0.5
- Puedo ponerlo en 0.6 para que empiece a cargar antes de que llegue al final
- Debo colocar el keyExtractor, la key debe de ser un string

~~~js
<CustomView margin>
  <Title text="InfiniteScroll" />
  <FlatList
    onEndReached={loadMore}
    data={numbers}
    renderItem={({item}: any)=>(
        <Text style={{height: 300, backgroundColor: colors.primary, color: 'white', fontSize: 50}}>{item}</Text>
    )}
    onEndReachedThreshold={0.6}
    keyExtractor={(item)=> item.toString()}
    />
</CustomView>
~~~
-----

## InfiniteScroll con imágenes

- Usaremos Lorem Picsum para las imágenes
- Creo un componente para renderizar los números

~~~js

import React, { useState } from 'react'
import { Text, View, VirtualizedListWithoutRenderItemProps } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { colors } from '../../../config/theme/theme'
import { FlatList } from 'react-native-gesture-handler'

export const InfiniteScroll = () => {

    const [numbers, setNumbers] = useState([0,1,2,3,4,5])

    const loadMore =()=>{
        const newArray = Array.from({length: 5}, (_,i)=>numbers.length +i)
        setNumbers([...numbers, ...newArray])
    }


  return (
    <CustomView margin>
      <Title text="InfiniteScroll" />
      <FlatList
        onEndReached={loadMore}
        data={numbers}
        renderItem={({item}: any)=>(
            <ListItem number={item} />
        )}
        onEndReachedThreshold={0.6}
        keyExtractor={(item)=> item.toString()}
        />
    </CustomView>
  )
}

interface ListItemProps{
    number: number
}

const ListItem = ({number}: ListItemProps)=>{
    return(
        <Text style={{height: 300, backgroundColor: colors.primary, color: 'white', fontSize: 50}}>{number}</Text>
    )
}
~~~

- Ahora en lugar de renderizar el texto renderizamos un Image 

~~~js
const ListItem = ({number}: ListItemProps)=>{
    return(
        <Image  source={{uri:`https://picsum.photos/id/${number}/500/400`}} 
        style={{
            height: 400,
            width: '100%'
        }}
        />
    )
}
~~~

- Cuando la imagen se carga en Android tiene un fadeIn pero en ios no
- Quiero mostrar algún tipo de indicador cuando estoy mostrando las imágenes
- Uso la prop ListFooterComponent de FlatList

~~~js
<CustomView margin>
      <Title text="InfiniteScroll" />
      <FlatList
        onEndReached={loadMore}
        data={numbers}
        renderItem={({item}: any)=>(
            <ListItem number={item} />
        )}
        onEndReachedThreshold={0.6}
        keyExtractor={(item)=> item.toString()}
        ListFooterComponent={()=>(
            <View style={{height: 150, justifyContent: 'center'}} >
                <ActivityIndicator size={50} color={colors.primary} />
            </View>
        )}  
        />
    </CustomView>
~~~
-----

## Animated Image

- Uso Animated.Image como componente
- Tengo una propiedad que es onLoadEnd que puedo usar para disparar la animación que extraigo del custom hook useAnimation
- El ActivityIndicator solo debe mostrarse si el isLoading está en true

~~~js

import React, { useState } from 'react'
import { Animated, ImageStyle, StyleProp, View } from 'react-native'
import { useAnimation } from '../../hooks/useAnimation'
import { ActivityIndicator } from 'react-native-paper'

interface Props{
    uri: string,
    style?: StyleProp<ImageStyle>
}

export const FadeInImage = ({uri, style}: Props) => {
    const {fadeIn, animatedOpacity}= useAnimation()
    const [isLoading, setIsLoading] = useState(true)
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>

    {isLoading && 
    <ActivityIndicator 
        style={{position: 'absolute'}}
        color= 'blue'
        size={30}
    />}

      <Animated.Image
        source={{uri}}
        onLoadEnd={()=>(
            fadeIn({duration:1000}),
            setIsLoading(false)
        )}
        style={[style, {opacity: animatedOpacity}]}
        
      />
    </View>
  )
}
~~~

- Se lo paso a ListItem para que lo renderice en el renderItem del FlatList
- Debo pasarle un height y un width para que muestre las imágenes

~~~js
const ListItem = ({number}: ListItemProps)=>{
    return(
        <FadeInImage uri={`https://picsum.photos/id/${number}/500/400`} 
            style={{
                height:400,
                width: '100%'
            }}
        />
        
    )
}
~~~
