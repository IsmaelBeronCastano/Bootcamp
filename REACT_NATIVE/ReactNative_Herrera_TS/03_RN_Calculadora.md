## REACT NATIVE - Calculadora

- Primero se hará código libre, luego se refactorizará y se creará un custom hook para realizar las operaciones (suma, resta, etc)
- Para crear un nuevo proyecto

> npx react-native init calculator --template react-native-template-typescript

## Estructura inicial

- En src/screens creo **CalculadoraScreen.tsx** con un View y un Text (uso el snippet personalizado rcv- React Component View)
- Renderizo CalculadoraScreen en App.tsx
- Para que no choque con el notch meto el View en un **SafeAreaView**
- Para colocar el fondo en negro creo la carpeta src/theme y dentro **AppTheme.tsx**
- Creo la hoja de estilos con el snippet personalizado **stles**

~~~js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    fondo:{
        flex:1,
        backgroundColor: 'black'
    },
    texto:{
        color: 'white',
        fontSize: 20
    }
})
~~~

- Se lo aplico al SafeAreaView

~~~js
import React from 'react'
import { CalculadoraScreen } from './src/screens/CalculadoraScreen'
import { SafeAreaView } from 'react-native'
import { styles } from './src/themes/AppTheme'



const App = () => {
  return ( 

    <SafeAreaView style={styles.fondo}>
        <CalculadoraScreen />
    </SafeAreaView>

  )
}

export default App
~~~
 
- Añado los estilos al texto de la calculadora

~~~js
import { Text, View } from "react-native"
import { styles } from "../themes/AppTheme"


export const CalculadoraScreen = ()=>{
return (
 <View>
     <Text style={styles.texto}>Calculadora</Text>
</View>
)}
~~~

- Manejar los estilos de esta manera (global) nos **quita flexibilidad**
- Hay otra manera de trabajar los estilos **basado en el context** (spoiler!) 
- Hay una cosa que quiero cambiar
  - En Android no me gusta que quede esa barra gris del status bar
  - En ios quiero que se mantenga el status bar 
- Coloco el **StatusBar** dentro del SafeAreaView
  - Con la propiedad backgroundColor cambio el color de fondo del StatusBar
  - Con barStyle light-content la de ios
- Puedes pulsar Ctrl + space bar para ver las opciones disponibles

~~~js
import React from 'react'
import { CalculadoraScreen } from './src/screens/CalculadoraScreen'
import { SafeAreaView, StatusBar } from 'react-native'
import { styles } from './src/themes/AppTheme'



const App = () => {
  return ( 

    <SafeAreaView style={styles.fondo}>
      <StatusBar
        backgroundColor= "black"
        barStyle="light-content"          
        />
        <CalculadoraScreen />
    </SafeAreaView>

  )
}

export default App
~~~

### Resumen:

- Creo un StyleSheet **global**. Más adelante se realizará mediante context
- Uso **StatusBar** y las propiedades backgroundColor y barStyle(para ios) para configurar la barra de estado y luzca del color que yo quiero
------

## Botones y estilos

- Quiero que en el Text de Calculadora Screen aparezca el resultado de la calculadora
- Si analizamos la calculadora veremos que es una columna que tiene varias rows
  - La del resultado
  - La de cada fila de números y operaciones matemáticas
- El diseño es **una colección de rows empujada hacia abajo** (porque donde se muestra el resultado en grande, arriba, encima suyo hay mucho aire)
- Cambio la etiqueta de estilos de styles.texto a styles.resultado (tiene más sentido)
  - Le pongo el fontSize de 60
  - Quiero que el texto esté alineado a la derecha, uso **alignText: 'right'**
  - Coloco un paddingHorizontal global 
  - **Si no funciona** puedo crear un calculadoraContainer en la StyleSheet y la coloco en el View de CalculadoraScreen en lugar de aplicarlo de forma global
  - Le coloco un **backgroundColor red** a calculadoraContainer para **poder manejarlo mejor**
  - Si le coloco **flex: 1** ocupará toda la pantalla
  - Como quiero empezar desde abajo usaré justifyContent: 'flex-end'
    - Esto sitúa el texto provisional que tengo **abajo a la derecha**. Puedo quitar el background red
  - Necesito colocar otro resultado más pequeño encima, copio la etiqueta de texto y le añado styles.resultadoPequeno
    - Para hacerlo un poco transparente uso **rgba**

~~~js
import { Text, View } from "react-native"
import { styles } from "../themes/AppTheme"


export const CalculadoraScreen = ()=>{
return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>1500</Text>
     <Text style={styles.resultado}>1500</Text>
</View>
)}
~~~

- Los estilos se van viendo así

~~~js
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    fondo:{
        flex:1,
        backgroundColor: 'black',
    },
    calculadoraContainer:{
        paddingHorizontal: 20,
        /*backgroundColor: 'red' //una vez visto que abarca toda la pantalla ya no es necesario */
        flex: 1,
        justifyContent: 'flex-end' //empezaremos desde abajo y las columnas empujarán hacia arriba el resultado
    },
    resultado:{
        color: 'white',
        fontSize: 60,
        textAlign: 'right', //el resultado a la derecha
    },
    resultadoPequeno:{
        color: 'rgba(255,255,255,0.4)', //uso transparencia
        fontSize: 40,
        textAlign: 'right',
    }
})
~~~

- Cada fila la podemos ver como un **View en modo row** con botones
- Cómo el botón tiene que tener un contenido, este estar en el centro, creo otro View
- **Los View son como los divs HTML**
- Creo boton en el StyleSheet para añadirle estilos

~~~js
boton:{
    height: 80,
    width:80,
    backgroundColor: "#333",
    borderRadius: 100
}
~~~

- Se los agrego al View

~~~js
import { Button, Text, View } from "react-native"
import { styles } from "../themes/AppTheme"


export const CalculadoraScreen = ()=>{
return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>1500</Text>
     <Text style={styles.resultado}>1500</Text>

    <View>
        <View style={styles.boton}>
            <Text>1</Text>
        </View>
    </View>


</View>
)}
~~~

- Uso el **justifyContent** en center para alinear el contenido (el 1) verticalmente
- Creo botonTexto con **textAlign en center** para alinear el texto horizontalmente

~~~js
boton:{
    height: 80,
    width:80,
    backgroundColor: "#333",
    borderRadius: 100,
    justifyContent: 'center'
},
botonTexto:{
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontSize: 30,
    fontWeight: '300'
}
~~~

- Aplico los estilos al Text dentro del View con styles.botonTexto
- Cómo voy a usar este componente un montón de veces, en lugar de clonarlo creemos un **componente reutilizable**

## Resumen:

- Ver descripción para la aplicación de estilos
- Uso rgba para la **transparencia**
- Los View **son cómo los divs** de HTML
- Para crear y centrar el contenido del botón uso un View con justifyContent y dentro un Text con alignText
----

## Botón de calculadora y sus filas

- Creo varias copias de los botones que he creado con View y Text para colocar bien una fila con CSS
- En el View dónde están los botones le coloco el estilo fila (que no he creado todavía) donde le diré que es flexDirection: 'row'
- Hay muchas maneras de resolver este diseño, space-between, space-around...pero el botón de 0 que ocupa dos espacios no resuelve bien
  - Podemos hacer un justifyContent: 'center' 
  - Coloco un marginBottom, un paddingHorizontal..
- AppTheme.tsx (StyleSheet)

~~~js
fila:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 10
    }
~~~

- Creo el componente del Botón
- Copio y pego el código que tenía en CalculadoraScreen dentro del return
- Puedo seguir usando los estilos globales o crear una hoja de estilos solo para el Botón
- Tiene sentido crearle su propia hoja de estilos, ya que todo lo relacionado al botón va a estar ahí

~~~js
import { StyleSheet, Text, View } from "react-native"

export const BotonCalc = ()=>{
return (
    <View style={styles.boton}>
        <Text style={styles.botonTexto}>1</Text>
    </View>
)}


const styles = StyleSheet.create({
    boton:{
        height: 80,
        width:80,
        backgroundColor: "#333",
        borderRadius: 100,
        justifyContent: 'center'
    },
    botonTexto:{
        textAlign: 'center',
        color: 'white',
        padding: 10,
        fontSize: 30,
        fontWeight: '300'
    }
});
~~~

- En CalculadoraScreen

~~~js
import { Button, Text, View } from "react-native"
import { styles } from "../themes/AppTheme"
import { BotonCalc } from "../components/BotonCalc"


export const CalculadoraScreen = ()=>{
return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>1500</Text>
     <Text style={styles.resultado}>1500</Text>

    <View style={styles.fila}>
        <BotonCalc />
        <BotonCalc />
        <BotonCalc />
        <BotonCalc />
    </View>


</View>
)}
~~~

- Todavía no hemos hecho customizable el botón. Todo a su tiempo!
- Ahora creo las propiedades **texto** y **color**
- Necesito tres colores #9B9B9B (gris pálido), #2D2D2D (gris oscuro), #FF9427 (naranja)
- El gris oscuro lo pongo por defecto en boton de la StyleSheet
- Si no declaro un valor por defecto en las props, **EL BOTON QUE NO RECIBE COLOR RECIBE UNDEFINED** y no muestra el backgroundColor 
- Por lo que debo **DEFINIRLO POR DEFECTO EN LAS PROPS**
- **Creo la propiedad color en la interface** de tipo string. La pongo opcional para que si no le envio color por las props no de error y le añada el background por defecto
- La **desestructuro** de las props del componente
- Desestructuro los estilos de styles.boton y le añado backgroundColor, le paso la prop
- Uso la misma estrategia con el color del texto. Si es gris pñalido usaré el negro, si no el blanco

~~~js
import { StyleSheet, Text, View } from "react-native"

interface Props{
    texto: string,
    color?: string
}

export const BotonCalc = ({texto, color="#2D2D2D"}: Props)=>{
return (
    <View style={{
        ...styles.boton,
        backgroundColor: color
    } }>
        <Text style={{
            ...styles.botonTexto,
            color: (color === '#9B9B9B') ? 'black': "white"
        }}>{texto}</Text>
    </View>
)}

const styles = StyleSheet.create({
    boton:{
        height: 80,
        width:80,
        borderRadius: 100,
        justifyContent: 'center',
        
    },
    botonTexto:{
        textAlign: 'center',
        color: 'white',
        padding: 10,
        fontSize: 30,
        fontWeight: '400'
    },

});
~~~

- Copio las filas. Le quito el color a los 3 primeros en las copias para seguir el diseño

~~~js
import { Button, Text, View } from "react-native"
import { styles } from "../themes/AppTheme"
import { BotonCalc } from "../components/BotonCalc"


export const CalculadoraScreen = ()=>{
return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>1500</Text>
     <Text style={styles.resultado}>1500</Text>

    <View style={styles.fila}>
        <BotonCalc texto="C" color="#9B9B9B"/>
        <BotonCalc texto="+/-" color="#9B9B9B"/>
        <BotonCalc texto="del" color="#9B9B9B"/>
        <BotonCalc texto="/" color="#FF9427"/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="7" />
        <BotonCalc texto="8"/>
        <BotonCalc texto="9"/>
        <BotonCalc texto="X" color="#FF9427"/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="4" />
        <BotonCalc texto="5"/>
        <BotonCalc texto="6"/>
        <BotonCalc texto="-" color="#FF9427"/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="1" />
        <BotonCalc texto="2"/>
        <BotonCalc texto="3"/>
        <BotonCalc texto="+" color="#FF9427"/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="0" />
        <BotonCalc texto="."/>
        <BotonCalc texto="=" color="#FF9427"/>
    </View>

</View>
)}
~~~

- El 0 tiene que ocupar 2 espacios
- Tengo que ser capaz de estirar el botón de 0, pero como puedo saber cuando estirarlo? 
  - Creo **una prop opcional que llamare ancho**
  - La declaro en las props como false para que no devuelva undefined
  - Cuando coloco una propiedad sin declarar en un componente la considera true
  - Tengo que sobreescribir el width. Actualmente el width de los botones es de 80, por lo que si quiero que ocupe el doble serán 160 (pero haciendo pruebas queda mejor 180)
  - Hago la condición
- Para hacer los botones interactivos uso **TouchableOpacity**
~~~js
export const BotonCalc = ({texto, color="#2D2D2D", ancho = false}: Props)=>{
return (
  <TouchableOpacity>
    <View style={{
        ...styles.boton,
        backgroundColor: color,
        width: ancho ? 180 : 80 
    } }>
        <Text style={{
            ...styles.botonTexto,
            color: (color === '#9B9B9B') ? 'black': "white",
        }}>{texto}</Text>
    </View>
    </TouchableOpacity><>
)}
~~~

- El componente del 0:

~~~js
<BotonCalc texto="0" ancho />
~~~

### Resumen:

- **Desestructuro los estilos** y añado las condiciones en la propiedad específica para renderizar condicionalmente con un estilo u otro
- Añado **props booleanas** opcionales **que alteren el componente** en el caso de declararlas
--------

## Construir el número base

- Podemos usar un useState
- El número será de **tipo string** porque estoy usando el componente Text
- Coloco el state en el Text de resultado
- El botón de C lo que hace es establecer el valor a 0 (como string!)
  - Creo la función para la tecla C y la llamo limpiar
  - Necesito **añadirle la prop para que ejecute la acción**. La llamaré acción.
    - Si no se como tiparlo en la interface, hago la declaración de la propiedad en el componente con la función y **pongo el cursor encima**
    - **La pongo opcional (de momento)** para que no me marque error en el resto de componentes, pero debe ser obligatoria
    - **La desestructuro de las props y se la añado al onPress**
  
~~~js
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props{
    texto: string,
    color?: string,
    ancho?: boolean,
    accion?: () => void  //de momento la pongo opcional para que no moleste 
}
                                                                //añado la prop
export const BotonCalc = ({texto, color="#2D2D2D", ancho = false, accion}: Props)=>{
return (

    <TouchableOpacity
    onPress={accion}>  
    <View style={{
        ...styles.boton,
        backgroundColor: color,
        width: ancho ? 180 : 80 
    } }>
        <Text style={{
            ...styles.botonTexto,
            color: (color === '#9B9B9B') ? 'black': "white",
        }}>{texto}</Text>
    </View>
    </TouchableOpacity>
)}

const styles = StyleSheet.create({
    boton:{
        height: 80,
        width:80,
        borderRadius: 100,
        justifyContent: 'center',
        
    },
    botonTexto:{
        textAlign: 'center',
        color: 'white',
        padding: 10,
        fontSize: 30,
        fontWeight: '400'
    },

});
~~~

- En la calculadora le paso la función específica de la tecla

~~~js
export const CalculadoraScreen = ()=>{

    const [numero, setNumero] = useState('100')

    const limpiar =()=>{
        setNumero('0')
    }

return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>1500</Text>
     <Text style={styles.resultado}>{numero}</Text>

    <View style={styles.fila}>
        <BotonCalc texto="C" color="#9B9B9B"
                    accion={limpiar} />
    {...code}
)}
~~~

- Para el número que hay encima usaré otro useState que llamaré numeroAnterior
- Lo coloco en la etiqueta Text. No lo debería de mostrar a menos que tenga un valor. *Lo puliremos después*
- Creo la función armarNumero, **a todos los números debo pasarles armarNumero**. El punto debería considerarse parte del número, también lo pongo

~~~js
 const armarNumero =(numeroTexto: string)=>{
        setNumero(numero + numeroTexto)
    }
~~~

- Me da error porque **la función me pide un argumento y en la interfaz no he puesto ninguno**. Lo pongo de tipo string. accion ya no es opcional!
- - Ahora **me marca error** porque cuando le paso la accion en el **onPress del componente no tiene ningun argumento**
- **Le paso el texto** (que es el número) y solucionado

~~~js
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props{
    texto: string,
    color?: string,
    ancho?: boolean,
    accion: (numeroTexto: string) => void
}

export const BotonCalc = ({texto, color="#2D2D2D", ancho = false, accion}: Props)=>{
return (

    <TouchableOpacity
    onPress={()=>accion(texto)}>
    <View style={{
        ...styles.boton,
        backgroundColor: color,
        width: ancho ? 180 : 80 
    } }>
        <Text style={{
            ...styles.botonTexto,
            color: (color === '#9B9B9B') ? 'black': "white",
        }}>{texto}</Text>
    </View>
    </TouchableOpacity>
)}

const styles = StyleSheet.create({
    boton:{
        height: 80,
        width:80,
        borderRadius: 100,
        justifyContent: 'center',
        
    },
    botonTexto:{
        textAlign: 'center',
        color: 'white',
        padding: 10,
        fontSize: 30,
        fontWeight: '400'
    },

});
~~~

- Ahora me marcan error **todos los botones que no tienen la prop accion**. Eso está bien
- Copio y pego la acción de limpiar **para que no estorbe con los errores** de esos botones que no son numeros **que ya tienen la funcion armarNumero**
- Ahora, cuando coloco muchos números la fila se coloca encima y lo que quiero es que los números se hagan más pequeños
- Lo configuro en la etiqueta Text de resultado
  - Uso las propiedades **numberOfLines** y **adjustsFontSizeToFit**
- CalculadoraScreen

~~~js
return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>{numeroAnterior}</Text>
     <Text style={styles.resultado}
        numberOfLines={1}
        adjustsFontSizeToFit
     >{numero}</Text> 
     
{...code}
)
~~~

- Hay varias cosas a validar.
- Por ejemplo, no me debería permitir colocar varios ceros delante
- No me debería permitir 0000.00
- Tampoco deberían salir los números con un 0 delante 08983 como pasa actualmente 

### Resumen:

- Uso un state de tipo string porque el componente es un Text
- Declaro la función en la interfaz, la desestructuro de las props del componente y se la paso al onPress
  - Como le tengo que pasar un argumento la ejecuto con una función de flecha
- Utilizo los atributos **numberOfLines** y **adjustsFontSizeToFit** para ajustar el resultado en una linea y el tamaño de los números se adapte
-------

## Consideraciones para armar el número

- Creo la función para el botón  -/+
- Uso .replace para sustituir el - por un string vacío
- Le paso la función a la tecla en lugar de la de limpiar que tenia para que no molestara con el error
~~~js
const positivoNegativo = ()=>{
        if(numero.includes('-')){
            setNumero(numero.replace('-',''))
        }else{
            setNumero('-'+ numero)
        }
    }
~~~

- De esta manera puedo poner -00.0 y es un poco raro
- En la función aramarNumero hay que hacer una serie de validaciones 
  
~~~js
const armarNumero =(numeroTexto: string)=>{
    //no aceptar doble punto
    if(numero.includes('.') && numeroTexto === '.') return;
    
    //si el numero empieza con 0 o -0
    if( numero.startsWith('0') || numero.startsWith('-0')){
        
        //Me permite agregar punto decimal
        if(numeroTexto === '.'){
            setNumero(numero + numeroTexto)
            
            //Evaluar si es otro 0 y hay un punto
        }else if(numeroTexto === '0' && numero.includes('.')){
            setNumero(numero + numeroTexto) //Esto mer permite escribir 0.0000
        
            //Evaluar si es un número diferente de 0 y no hay un punto
            //Si el numero es 0 y no hay un punto debería sustiuir el 0 por el numero
        }else if(numeroTexto !== '0' && !numero.includes('.')){
            setNumero(numeroTexto)
        
            //No poder escribir 000.00000000
        }else if(numeroTexto === '0' && !numero.includes('.')){
            
            setNumero(numero) //ignoro cualquier entrada
        
        }
    }else{
        setNumero(numero+numeroTexto)
    }


}
~~~ 
------

## Botón de borrar última entrada

- El del debe borrar solo el último dato (el último número introducido)
- Creo la función. De esta forma es bastante legible

~~~js
const btnDelete =()=>{
    const esNegativo = numero.includes('-')
    let nuevoNumero = numero.substring(0, numero.length -1)

    if(esNegativo){
        nuevoNumero = nuevoNumero.substring(1)
    }

    setNumero(esNegativo? '-'+ nuevoNumero : nuevoNumero)

    if (nuevoNumero === ''){
        setNumero('0')
    }
}
~~~

- Esta podría ser la manera más eficiente

~~~js
const btnDelete =()=>{
    if(numero.length === 1 || numero.startsWith('-') && numero.length === 2){
        return setNumero('0')
    }
    setNumero(numero.slice(0,-1))
}
~~~
----

## Operaciones aritmeticas

- Primero hay que preparar un poco el terreno
- Quiero que al apretar la tecla de la operación (+,-,/,x) el numero pase a la fila de arriba (más pequeño y translúcido) y debo mantener la referencia de qué operación quiero realizar
- Para realizar la acción de cambiar el numero de fila creo la función cambiarNumeroPorAnterior


