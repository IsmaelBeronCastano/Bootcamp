# REACT NATIVE - APP PUNTOS

- App de puntos en un mapa que se listan y permaneces el mapa, que puedo ocultar y mostrar
- Instalo react-native-maps
- Para visualizar el MapView debo darle un tamaño en los estilos
- En el emulador debo seleccionar Android Plattform with Google APIs
- En AndroidManifest.xml añadir dentro de application

~~~xml
<meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value= "MyGoogle_API_KEY"/>
~~~
-----

## Agregar Modal

- Inlcuiremos un modal con un smiley
- Creo en src/Components Modal.tsx y Map.tsx

- Modal.tsx

~~~js
import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

export default () => {
  return (
    <Modal 
    animationType='slide'
    transparent={true}
    visible={true}  //aqui usaremos useState para mostrarlo o no
    >
      <View style={styles.center}>
        <View style={styles.modalView}>
          <Text>😊</Text>
        </View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
    center:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalView:{
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 20,
        shadowColor: 'black',
        shadowOffset:{
          width: 0,
          height: 3
        }
      } 
});
~~~

- Map.tsx

~~~js
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps'

export default () => {
  return (
    <MapView style={styles.map} />    
  )
}

const styles = StyleSheet.create({
    map:{
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
      },
});
~~~

- Creo un archivo de barril index.ts (no .tsx) para las importaciones

~~~js
export{default as Map} from './Map'
export{default as Modal} from './Modal'
~~~

- Importo los componentes en App.tsx

~~~js
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import  {Map, Modal}  from './src/Components'

const App = () => {
  return ( 

    <View style={styles.container}>
     <Map />
     <Modal />
    </View>

  )
}

export default App


const styles = StyleSheet.create({
      container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
      }
});
~~~
-----

## Agregar Panel

- Para mostrar el panel inferior habrá que cambiar la altura del mapa
- Si le resto pixels al height de Dimensions me los restará de arriba y abajo
- Como quiero solo tener el espacio abajo, cambio el justifyContent de App (en styles.container) por flex-start

~~~js
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps'

export default () => {
  return (
    <MapView style={styles.map} />    
  )
}

const styles = StyleSheet.create({
    map:{
        height: Dimensions.get('window').height - 150,
        width: Dimensions.get('window').width
      },
});
~~~

- Ahora debemos crear los botones de listar los puntos y mostrar/ocultar, lo hago en Components/Panel.tsx

~~~js
import { Button, StyleSheet, Text, View } from 'react-native'
import React  from 'react'

export default ()=> {
    return (
      <View style={styles.panel}>
        <Button title="Lista" />
        <Button title="Mostrar/Ocultar" />
      </View>
    )
  
}

const styles = StyleSheet.create({
      panel:{
        flex: 1,
        flexDirection: 'row', //los quiero uno al lado del otro
        //backgroundColor: "red" para ver que ocupa todo el alto y usar flex para ubicar los botones
        justifyContent: 'center',
        alignItems: 'center'
      }
});
~~~

- Lo renderizo en App
-----

## Registrando toques del usuario

- Crearemos una función que pase de arriba hacia abajo (de App a sus hijos) para que cuando pinchemos haciendo un onLongPress nos permita agregar un punto
- Oculto el modal momentaneamente cambiando visible a false (ya que ahora no lo necesito)
- Creo la función con un console.log y se la paso como prop a Mapa 

~~~js
const App = () => {
  
  const handleLongPress = (punto: any)=>{
    console.log(punto)
  }

  return ( 

    <View style={styles.container}>
     <Map longPress ={handleLongPress} />
     <Modal />
     <Panel />
    </View>

  )
}
~~~

- En mapa debo crear la interfaz para las props
- Para tipar correctamente situar el cursor encima de la prop

~~~js
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps'


interface Props{
  onLongPress: (event:LongPressEvent)=> void | undefined
}


export default ({onLongPress}: Props)  => {
  return (
    <MapView style={styles.map} onLongPress={onLongPress} />    
  )
}

const styles = StyleSheet.create({
    map:{
        height: Dimensions.get('window').height - 150,
        width: Dimensions.get('window').width
      },
});
~~~

- Lo añado al Mapa de App

~~~js
const App = () => {
  
  const handleLongPress = (punto: any)=>{
    console.log(punto)
  }

  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />
     <Modal />
     <Panel />
    </View>
  )
}
~~~

- Si mantengo apretado en la pantalla me aparece un objeto con un montón de info
- Lo que nos interesa es este objeto

~~~json
"nativeEvent": {"coordinate": {"latitude": -21.45796644594332, "longitude": -5.50276804715395}, "position": {"x": 497, "y": 1043}}
~~~

- Puedo desestructurar nativeEvent desde la función handleLongPress

~~~js
const handleLongPress = ({nativeEvent}: any)=>{
    console.log(nativeEvent)
  }
~~~
------

## Agregando puntos con useState

- Inicio useState con un arreglo vacio
- Uso **spread operator** para que no se borren los puntos anteriores guardados en el state

~~~js
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import  {Map, Modal, Panel}  from './src/Components'


interface Puntos{
  coordinate: {
    latitude: number,
    longitude: number
  }
}


const App = () => {

  const [puntos, setPuntos] = useState<Puntos[]>([])

  useEffect(()=>{
    setPuntos([])
  },[])
  
  const handleLongPress = ({nativeEvent}: any)=>{

    const newCoord = {coordinate: nativeEvent.coordinate}
    
    setPuntos([...puntos, newCoord])
  }
  
  console.log(puntos)
  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />
     <Modal />
     <Panel />
    </View>

  )
}

export default App


const styles = StyleSheet.create({
      container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }
});
~~~
------

## Refactorizando el modal

- No tengo la manera de asignar una cadena de texto a cada punto
- Voy a tenr que construir un prompt para pedir datos al usuario desde el modal
- Puedo pasarle componentes a través de children. Le hago la interfaz correspondiente
- Añado la prop visibility para poder decidir si lo muestro o no con un state

~~~js
import React, { ReactNode } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

type Props ={
  children: JSX.Element | ReactNode
  visibility: boolean
}

export default ({children, visibility}: Props) => {
  return (
    <Modal 
    animationType='slide'
    transparent={true}
    visible={visibility}
    >
      <View style={styles.center}>
        <View style={styles.modalView}>
          {children}
        </View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
    center:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalView:{
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 20,
        shadowColor: 'black',
        shadowOffset:{
          width: 0,
          height: 3
        }
      } 
});
~~~

- **NOTA**: no dejes espacio entre las etiquetas de los componentes! 

~~~js
//por ejemplo, no hagas esto
<View> <Text>lala </Text></View>

//haz esto
<View><Text>lala</Text></View>

//conviene usar ternarios antes que && para renderizar condicionalmente

//no hagas esto

{valor && <Text>lala</Text>}

//haz esto

{valor ? <Text>lala</Text> : null}
~~~
-----

## Cuando un prompt para ingresar el nombre del punto

- Creamos el componente Input.tsx de TextInput para mostrar con el modal

~~~js
import { Text, View, TextInput, StyleSheet } from 'react-native'
import React, {useState}  from 'react'


interface Props{
    title: string,
    placeholder: string
    onChangeText: (text:string)=> void //tipado de la función con useState para guardar el nombre
}

export default ({title,...rest}: Props)=> {
    return (
      <View style={styles.wrapper} >
        <Text>{title}</Text>
        <TextInput {...rest} />
      </View>
    )
  
}

const styles = StyleSheet.create({
      wrapper:{
        height: 40,
      }
});
~~~

- Lo exporto en el index
- Uso useState para guardar el nombre del punto en onChangeText. De momento coloco un string
- Creo dos states más: una variable temporal y otra para mostrar el modal
- Le paso las coordenadas a setPuntoTemp y le cambio el valor a visibility para que muestre el modal

~~~js
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import  {Input, Map, Modal, Panel}  from './src/Components'


interface Puntos{
  nombre: string
  coordinate: {
    latitude: number,
    longitude: number
  }
}


const App = () => {

  const [visibility, setVisibility] = useState<boolean>(false) //visibilidad del modal

  const [puntos, setPuntos] = useState<Puntos[]>([])

  const [nombre, setNombre] =useState<string>("")

  const [puntoTemp, setPuntoTemp] = useState({})


  const handleLongPress = ({nativeEvent}: any)=>{

    const newCoord = {coordinate: nativeEvent.coordinate}
    
    setPuntoTemp(newCoord)  //guardo el punto del longPress en una variable temporal 
    setVisibility(true)    //cambio la visibilidad del modal a true
  }

  const handleOnChangeText =(text: string)=>{
    setNombre(text)

    console.log(nombre)
  }

  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />
     <Modal visibility={visibility}><Input title="Nombre" placeholder="Nombre del punto" onChangeText={handleOnChangeText} /></Modal>
     <Panel />
    </View>
  )
}

export default App


const styles = StyleSheet.create({
      container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }
});
~~~

## Agregando los puntos al estado con sus nombres

- Necesito agregar un botón para que al presionarlo, tome la variable de nombre y el punto temporal y lo agregue a setPuntos
- En el onPress le paso handleSubmit. Debe tomar el punto temporal y el nombre y construir un objeto que pasarle a setPuntos
- Necesito otro botón de cancelar que setee el texto temporal vacío, tiene que pasarle este texto vacío al input para que se resetee, cerrar el modal y limpiar el punto temporal

~~~js
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button} from 'react-native'
import  {Input, Map, Modal, Panel}  from './src/Components'


type coords ={latitude: number, longitude: number}

interface Puntos{
  nombre?: string 
  coordinate: coords | undefined
}


const App = () => {

  useEffect(()=>{
    setPuntos([])
  },[])

  const [visibility, setVisibility] = useState<boolean>(false) //visibilidad del modal

  const [puntos, setPuntos] = useState<Puntos[]>([])

  const [nombre, setNombre] =useState<string>("")

  const [puntoTemp, setPuntoTemp] = useState<coords>()


  const handleLongPress = ({nativeEvent}: any)=>{

    const newCoord= {...nativeEvent.coordinate as coords}
    
    setPuntoTemp(newCoord)
    setVisibility(true)
  }

  const handleOnChangeText =(text: string)=>{
    setNombre(text)
  }

  const handleSubmit =()=>{
    const newPunto = {coordinate: puntoTemp, nombre}
    console.log(newPunto)
    setPuntos([...puntos, newPunto])
    setVisibility(false)
    setNombre("")
    console.log(puntos)
  }

  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />
     <Modal visibility={visibility}><Input title="Nombre" placeholder="Nombre del punto" onChangeText={handleOnChangeText} />
      <Button title="Aceptar" onPress={handleSubmit} />
     </Modal>
     <Panel />
    </View>
  )
}

export default App


const styles = StyleSheet.create({
      container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }
});
~~~
----

## Cambiando componentes en el modal

- Para que al apretar el botón Listar me muestre los puntos agregaremos al modal un renderizado condicional con un enum
- Creo otro state y uso un ternario para renderizar condicionalmente. Uso un fragment, ya que los elementos necesitan un contenedor
- Debo setear el filtro de visibilidad en newPunto en handleLongPress
- Cuando el argumento del callback es el mismo que el parámetro de la función solo necesitas poner la función

~~~js
//por ejemplo, en lugar de esto

onChangeText={(text)=> handleText(text)}

//puedes poner esto

onChangeText={handleText}
~~~

~~~js
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button} from 'react-native'
import  {Input, Map, Modal, Panel}  from './src/Components'


type coords ={latitude: number, longitude: number}

interface Puntos{
  nombre?: string 
  coordinate: coords | undefined
}

enum Filter{ //creo el enum para el renderizado condicional
  new_Punto= 0,
  all_Puntos= 1
}


const App = () => {

  useEffect(()=>{
    setPuntos([])
  },[])

  const [visibility, setVisibility] = useState<boolean>(false) //visibilidad del modal

  const [puntos, setPuntos] = useState<Puntos[]>([])

  const [nombre, setNombre] =useState<string>("")

  const [puntoTemp, setPuntoTemp] = useState<coords>()

  const [visibilityFilter, setVisibilityFilter] = useState<Filter>(Filter.new_Punto)


  const handleLongPress = ({nativeEvent}: any)=>{

    const newCoord= {...nativeEvent.coordinate as coords}
    
    setVisibilityFilter(Filter.new_Punto) //para el renderizadocondicional del propmpt,  para introducir el nombre del punto
    setPuntoTemp(newCoord) //le paso las coord a la variable temporal que guardaré con el handleSubmit
    setVisibility(true) //hago visible el modal
  }

  const handleOnChangeText =(text: string)=>{
    setNombre(text)
  }

  const handleSubmit =()=>{
    const newPunto = {coordinate: puntoTemp, nombre}
    console.log(newPunto)
    setPuntos([...puntos, newPunto])
    setVisibility(false)
    setNombre("")
  }

  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />                                
     <Modal visibility={visibility}><Input title="Nombre" placeholder="Nombre del punto" onChangeText={handleOnChangeText} />
      <Button title="Aceptar" onPress={handleSubmit} />
    {visibilityFilter === Filter.new_Punto 
    ? <>
      <Input title="Nombre" placeholder="Nombre del punto" onChangeText={handleOnChangeText} />
      <Button title="Aceptar" onPress={handleSubmit} />
       </> 
       : <Text>lalala</Text>} 
     </Modal>
     <Panel />
    </View>
  )
}

export default App


const styles = StyleSheet.create({
      container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }
});
~~~

- Vamos con el botón de Listar
- Hay que setear el visibilityFilter en all_Puntos, visibility del modal a true y listar en un componente el state con los puntos guardados

~~~js
const handleLista =()=>{
    setVisibilityFilter(Filter.all_Puntos)
    setVisibility(true)
  }
~~~
- Me organizo el onPress con onPressLeft y onPressRight para poder asignarlos desde el componente Panel

~~~js
import { Button, GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import React  from 'react'

interface Props{
  onPressLeft:  ((event: GestureResponderEvent) => void) | undefined
  onPressRight:  ((event: GestureResponderEvent) => void) | undefined
}

export default ({onPressLeft, onPressRight}: Props)=> {
    return (
      <View style={styles.panel}>
        <Button title="Lista" onPress={onPressLeft} />
        <Button title="Mostrar/Ocultar" onPress={onPressRight} />
      </View>
    )
  
}
~~~ 

- En App.tsx tengo Panel

~~~js
<Panel onPressLeft={handleLista} onPressRight={handleMostrarOcultar} />
~~~

- Puedo hacer el panel reutilizable añadiendo la prop textLeft ( que será una variable que le pasaré a title)

~~~js
interface Props{
  onPressLeft:  ((event: GestureResponderEvent) => void) | undefined
  onPressRight:  ((event: GestureResponderEvent) => void) | undefined
  textLeft: string
  textRight: string
}

export default ({onPressLeft, onPressRight, textLeft, textRight}: Props)=> {
    return (
      <View style={styles.panel}>
        <Button title={textLeft} onPress={onPressLeft} />
        <Button title={textRight} onPress={onPressRight} />
      </View>
    ) 
}
~~~

- En App.tsx

~~~js
<Panel onPressLeft={handleLista} textLeft="Listar" onPressRight={handleMostrarOcultar}  textRight="Mostrar/Ocultar"/>
~~~
-----

## Mostrar Listado de puntos

- Crearemos el componente List

~~~js
import { FlatList, Text, View } from 'react-native'
import React  from 'react'
import { Puntos } from '../../App'

interface Props{
  puntos: Puntos[]
}

export default ({puntos}: Props)=> {
    return (
      <FlatList
      data={puntos.map((x:Puntos)=> x.nombre)}
      renderItem={({item})=> <Text>{item}</Text>}
      keyExtractor={(item: any)=> item}
      />
    ) 
}
~~~

- 