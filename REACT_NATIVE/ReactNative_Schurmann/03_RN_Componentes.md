# REACT NATIVE - Componentes

- Partimos de aquí

~~~js
import { StyleSheet, Text, View } from "react-native"

const App = ()=>{
return (
 <View style={styles.container}>
     <Text>Hola mundo!</Text>
</View>
)}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center'
  }
});

export default App
~~~

## TextInput

- TextInput **recoge el texto** que ingrese el usuario
- Para hacerlo visible usamos los estilos

~~~js
  input:{
    height: 40,
    width: 60,
    borderColor:'black',
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#eee'
  }
~~~

- Si quiero que ocupe todo el ancho de la pantalla disponible puedo usar '100%' en el width, 
- También puedo **tomar las dimensiones de la pantalla y usarlas**

~~~js
const {width, height} = Dimensions.get('window')
~~~

- Con .get podemos obtener las dimensiones de **window** y **screen**
- En TextInput tengo la propiedad **placeholder**
- También **onChangeText**, que me permite pasarle una función que recoja el texto
- Puedo pasarle la propiedad defaultValue para que tenga un valor por defecto ( e indicarlo en el useState en lugar de un string vacío)

~~~js
import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native"
import { useState } from "react"

const {width, height} = Dimensions.get('window')

const App = ()=>{

  const [text, setText] = useState('texto por defecto')

return (
 <View style={styles.container}>
     <Text>{text}</Text>
     <TextInput style={styles.input} placeholder="Ingresa texto" 
     onChangeText={txt=>setText(txt)} 
     defaultValue={text} />
</View>
)}
~~~

- Los estilos ya depende de cada unx

~~~js
input:{
    height: 40,
    width: width,
    backgroundColor: '#eee',
    borderBottomWidth: 3, //en lugar de resaltar todo el border puedo resaltar solo el bottom
    borderBottomColor: 'black'
  }
~~~
-------

## Eventos táctiles

- Si uso Button no le aplico estilos. Si estoy en Android tendrá unos predeterminados, en ios otros
- La propiedad **title es obligatoria**
- Para pasarle la función uso **onPress**

~~~js
 <Button title="Aceptar" onPress={()=>setText('')} />
~~~

- Para usar el botón como submit para mostrar el texto ingresado, creo otro state

~~~js
import { StyleSheet, Text, View, TextInput, Dimensions, Button } from "react-native"
import { useState } from "react"

const {width, height} = Dimensions.get('window')

const App = ()=>{

  const [text, setText] = useState('texto por defecto')
  const [submit, setSubmit] = useState('')

return (
 <View style={styles.container}>
     <Text>{submit}</Text>
     <TextInput style={styles.input} placeholder="Ingresa texto" 
     onChangeText={txt=>setText(txt)} 
     defaultValue={text} />
     <Button title="Aceptar" onPress={()=>setSubmit(text)} />
</View>
)}
~~~

- Es un botón genérico para el envío de datos
-----

## Más botones

- Hay otros 4 botones
  - **TouchableHighLight**
    - El título no se pasa como propiedad si no como children
    - No le puedo pasar un texto directamente, debo usar Text
    - Si puedo aplicarle estilos
      - Con **underlayColor** cambia el color al hacer click sobre él
      - Con **activeOpacity** cambia el valor de la opacidad del texto al clicarlo. 0.1 es casi invisible 
  
~~~js
<TouchableHighlight onPress={()=>setSubmit(text)}
underlayColor='purple'
activeOpacity={0.1}>
  <Text>Acceptar</Text>
</TouchableHighlight>
~~~

- **TouchableNativeFeedback** pertenece **solo a Android**
  - Con la propiedad **background** usando el método Ripple le puedo indicar que color quiero en la reacción y la opacidad
    - Me pide los argumentos color, borderless y rippleRadius
  - Como children coloco un View con un Text dentro, le aplico estilos al View (solo para ver cómo reacciona el botón)
    - Con borderless en false se rellena de una forma animada con el color indicado
    - Con borderless en true lo hace de forma circular
~~~js
<TouchableNativeFeedback onPress={()=>setSubmit(text)}
  background={TouchableNativeFeedback.Ripple('#00f',false)}>
    <View style={styles.view}>
      <Text>Acceptar</Text>
    </View>
  </TouchableNativeFeedback>

  //styles
  {
    view:{
    flex: 0.5
  }
  }
~~~

- **TouchableOpacity** no recibe la propiedad de background **pero si un style**
  - Cambio los estilos del View

~~~js
touchableOpacity:{
  backgroundColor: 'red',
},
view:{
  height: 40,
  width: 300,
  alignItems:'center',
  justifyContent:'center'
}
~~~

- Por defecto se vuelve translucido cuando lo presionas
- El siguiente botón es **TouchableWithoutFeedback**
  - Este botón **no hará nada** cuando lo presionemos
  - Es para darle un **comportamiento customizado**
-------

## Componente ScrollView

- Lo coloco **dentro del View Principal**
- El contenido (que estaba en el centro) ha pasado todo al top, porque ScrollView va a tratar de utilizar todo el espacio
- En este caso no puedo hacer scroll porque no tengo suficiente contenido
- Copio y pego el mismo componente varias veces para poder usar el scroll

~~~js
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView} from "react-native"
import { useState } from "react"

const {width, height} = Dimensions.get('window')

const App = ()=>{

  const [text, setText] = useState('texto por defecto')
  const [submit, setSubmit] = useState('')

return (
 <View style={styles.container}>
    <ScrollView>
      <Text>{submit}</Text>
     <TextInput style={styles.input} placeholder="Ingresa texto" 
     onChangeText={txt=>setText(txt)} 
     defaultValue={text} />
     <TouchableOpacity onPress={()=>setSubmit(text)}
      style={styles.touchableOpacity}>
        <View style={styles.view}>
          <Text>Acceptar</Text>
        </View>
     </TouchableOpacity>
     {/*copia y pega varias veces para tener suficiente contenido y hacer scroll
      <TextInput style={styles.input} placeholder="Ingresa texto" 
     onChangeText={txt=>setText(txt)} 
     defaultValue={text} />
     <TouchableOpacity onPress={()=>setSubmit(text)}
      style={styles.touchableOpacity}>
        <View style={styles.view}>
          <Text>Acceptar</Text>
        </View>
     </TouchableOpacity>
     */}
      </ScrollView>
</View>
)}


const styles = StyleSheet.create({
  touchableOpacity:{
    backgroundColor: 'red',
  },
  view:{
    height: 40,
    width: 300,
    alignItems:'center',
    justifyContent:'center'
  },
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  input:{
    height: 40,
    width: width,
    backgroundColor: '#eee',
    borderBottomWidth: 3, //en lugar de enmarcarlo todo puedo resaltar solo el bottom
    borderBottomColor: 'black'
  }
});

export default App
~~~

- Puede aparecer una barra lateral de desplazamiento porque no le estoy indicando al scroll que use todo el ancho de la pantalla
- Para aplicar estilos a la barra lateral del scroll uso los estilos

~~~js
scroll:{
  width: width,  //le paso el width que extraje con Dimensions
}
~~~
----

## Listas en React Native y FlatList

- ScrollView tiene un problema, y es que **va a tratar de imprimir todo lo que se encuentra dentro de él**
- Si tenemos un listado con 1.000 elementos, **esto va a afectar el rendimiento**
- Para ello tenemos **FlatList**
  - Recibe **data (un arreglo)** y **renderItem**, que recibirá una función que definirá el renderizado de sus componentes
    - Recibe un objeto como primer argumento, que es la info de lo que vamos a renderizar
    - Uso la desestructuración de **item** para extraerlo y en el cuerpo de la función el componente que voy a usar para renderizarlo
    - La propiedad de key **es necesaria**. Debe ser un string
- Puedo agregarle estilos sin problema
~~~js
import { StyleSheet, Text, View, FlatList} from "react-native"

const App = ()=>{

return (
 <View style={styles.container}>

  <FlatList  data={[
    {key:'1', nombre: "Miguel"},
    {key:'2', nombre:"Pepe"},
    {key:'3', nombre:"María"},
    {key:'4', nombre:"Lucas"},
    {key:'5', nombre:"Petra"},
    {key:'6', nombre:"Juana"}

  ]} renderItem={({item})=><Text style={styles.item}>{item.nombre}</Text>} />

</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'stretch', //en este caso baseline también funcionaria
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  },
  item:{
    padding: 10,
    fontSize: 22,
    height: 50,
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default App
~~~
-----

## SectionList

- SectionList me permite separar el contenido mediante algún orden lógico (cómo el orden alfabético)
- Debe recibir **en las props sections un arreglo con las propiedades title y data dentro de un objeto, data con un arreglo con la data a mostrar**
- Hay que añadir también **la función renderItem** de la que desestructuramos **item** para renderizar el componente con la data y **renderSectionHeader** de la que desestructuramos **section** para renderizar la sección y le pasamos title

~~~js
import { StyleSheet, Text, View, SectionList} from "react-native"

const App = ()=>{

return (
 <View style={styles.container}>
 <SectionList sections={[
  {title: "Grupo1", 
  data: [
   {key:'1', nombre: "Miguel"},
   {key:'2', nombre:"Pepe"},
   {key:'3', nombre:"María"},
 ]},
 {title: "Grupo2",
  data:[
  {key:'4', nombre:"Lucas"},
  {key:'5', nombre:"Petra"},
  {key:'6', nombre:"Juana"}
  ]}
]} 
renderItem={({item})=> <Text style={styles.item} >{item.nombre}</Text>}
renderSectionHeader={({section})=><Text style={styles.section} >{section.title}</Text>}
/>

</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'stretch',
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  },
  item:{
    padding: 10,
    fontSize: 22,
    height: 50,
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  section:{
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ccc',
    paddingTop:2,
    paddingLeft: 10,
    paddingBottom: 2,
  }
});

export default App
~~~
-----

## Obtener datos de una API

- Usaremos una FlatList para el ejemplo
- Usaremos useState y useEffect para tarernos los datos
- Usaremos https://jsonplaceholder.typicode.com/users para imprimir los users
- Uso **Paste JSON as Code** para crear la interfaz y tipar el state para que no de problemas
- Hago un fetch en el useEffect para renderizar los nombres de los usuarios
- Como no dispongo de una key, puedo usar **keyExtractor**. Desestructuro el id de User
- KeyExtractor **necesita un string**, no un number como está tipado el id, por lo que lo convierto

~~~js
import { StyleSheet, Text, View, FlatList} from "react-native"
import { useState, useEffect } from "react";

export interface User {
  id:       number;
  name:     string;
  username: string;
  email:    string;
  address:  Address;
  phone:    string;
  website:  string;
  company:  Company;
}

export interface Address {
  street:  string;
  suite:   string;
  city:    string;
  zipcode: string;
  geo:     Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name:        string;
  catchPhrase: string;
  bs:          string;
}

const App = ()=>{

const [users,setUsers] = useState<User[]>([])
const [loading, setLoading] = useState(true) //le doy el valor de true para asegurarme de que apenas cargue la app estará en loading

useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/users')
        .then(response=> response.json()) //transformo los datos que obtengo en un json
        .then(data=>{
          setUsers(data) //le paso la data al estado
          setLoading(false)
        })
}, [])


if(loading){
  <View style={styles.center}>
    <Text>Cargando..</Text>
  </View>
}
return (
 <View style={styles.container}>
  <FlatList 
  data={users}
  renderItem={({item})=> <Text>{item.name}</Text>}
  keyExtractor={({id})=>String(id)}
  />

</View>
)}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
    alignItems:'stretch',
    justifyContent:'center',
    paddingTop: 22 //para alejarlo un poco de arriba
  },
  item:{
    padding: 10,
    fontSize: 22,
    height: 50,
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App
~~~
