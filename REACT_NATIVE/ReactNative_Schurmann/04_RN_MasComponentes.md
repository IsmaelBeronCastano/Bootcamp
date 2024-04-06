# REACT NATIVE - MÁS COMPONENTES

## ActivityIndicator

- Muestra un spinner de carga
- Debo añadir size y color
- El tamaño large se usa para toda la pantalla bloqueada y el small para pequeñas prociones del código para indicar que se está cargando una parte pero se puede seguir interactuando con la app

~~~js
const App = ()=>{

return (
 <View style={styles.container}>
  
  <ActivityIndicator  size="large" color="#0000ff" />

</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'stretch',
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  }
});

export default App
~~~
----

## Cómo trabajar con imágenes

- Tenemos que indicar necesariamente el tamaño de las imágenes
- Cuando el source viene del sistema de archivos hay que usar **require**

~~~js
 <View style={styles.container}>
  
<Image style={styles.photo} source={require("./src/assets/google.jpg")} />

</View>
~~~

- Para usar una url hay que indicárselo con 

~~~js
 <View style={styles.container}>
  
<Image style={styles.photo} source={{uri: "http://placekitten.com/g/60/60"}} />

</View>
~~~
-------

## ImageBackground (imagen de fondo)

- Este componente no tiene etiqueta de autocierre.
- Lo que coloquemos en el children aparecerá en la imagen

~~~js

const App = ()=>{

return (
 <View style={styles.container}>
  
<ImageBackground style={styles.photo} source={{uri: "http://placekitten.com/g/200/200"}}>
  <Text style={{color: "white"}} >Gatito!</Text>
</ImageBackground>

</View>
)}
~~~
------

## Modales

- Hago uso del useState para marcar el estado de si el modal se encuentra visible o no
- **AnimationType** es el tipo de animación, tengo **fade** (aparece lentamente), **none**, **slide**
- **Transparent** con transparencia
- **Visible** indica si se encuentra visible, le paso el estado
- **onRequestClose** permite ejecutar código con una función una vez que el modal haya sido cerrado
- Como al modal le he puesto que sea transparente coloco otro View dentro con styles.content
- Utilizo **un botón para cerrar y otro para abrir**
- Puedo renderizo condicionalmente el botón de abrir para que no se muestre con el modal
- Le doy un color al fondo para ver la caja del modal en styles.content
- Si coloco texto fuera del modal, lo voy a poder ver. Esto es por **transparent en true**
- Para que ocupe toda la pantalla le coloco flex:1 a **styles.content**, con esto tiene el alto del 100%
- Como el alignItems del padre está en center no puedo usar todo el ancho. Lo cambio a stretch
- Uso justifyContent para centrar el botón de cerrar modal
- Le añado un margin para poder ver un poco de fondo
- A styles.center le puedo agregar un color rgba con transparencia para que al abrir el modal, los bordes que me permiten ver el margin sea un poco más oscuro

~~~js
import { StyleSheet, Text, View, Image, Modal, Button} from "react-native"
import { useState} from "react";


const App = ()=>{

  const [modal,setModal] = useState<boolean>(false)

return (
 <View style={styles.container}>
  <Modal 
  animationType="slide"
  transparent={false}
  visible={modal}
  onRequestClose={()=>{}}
   >
    <View style={styles.center}>
      <View style={styles.content}>
        <Text>Soy un Modal</Text>
        <Button title="Cerrar Modal" onPress={()=>{setModal(!modal)}} />
      </View>
    </View>
   </Modal>

   <Text>Estoy fuera del modal</Text>
   <Text>Estoy fuera del modal</Text>
   <Text>Estoy fuera del modal</Text>
   <Text>Estoy fuera del modal</Text>
   <Text>Estoy fuera del modal</Text>

   {!modal && <Button title="Abrir Modal" onPress={()=>setModal(!modal)} />}
   
</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  },
  photo:{
    height: 200,
    width: 200
  },
  center:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  content:{
    flex:1,
    backgroundColor: 'red',
    justifyContent: 'center',
    margin:25
  }
});

export default App
~~~
------

## Alert, crea diálogos nativos

- Creo un botón al que le paso la función que dispara el Alert
- Con Alert.alert recibe 1 parámetro obligatorio (título) y dos opcionales que es el message y el buttons
- Para pasarle el tercer argumento (buttons) se hace mediante un arreglo de objetos que contienen propiedades
  - Entre ellas text (texto que contiene el botón), onPress (lo que ocurre al presionarlo) y style
- A la función le podemos indicar un cuarto argumento con otro objeto para definir si es cancelable o no

~~~js
import { StyleSheet, Text, View, Image, Modal, Button, Alert} from "react-native"
import { useState} from "react";


const crearDialogo = ()=>Alert.alert(`Título`, 'Este es el mensaje', [
  {
    text: "Cancelar",
    onPress: ()=>{},
    style: 'cancel'
  },
  {
    text:'Aceptar',
    onPress: ()=>{},
    style: 'default'
  }
 ],
{cancelable: false}
)

const App = ()=>{

return (
 <View style={styles.container}>

   <Button title="Abrir dialogo" onPress={crearDialogo} />
</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  }
});

export default App
~~~
