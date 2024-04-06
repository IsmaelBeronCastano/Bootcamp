## REACT NATIVE - Counter App

- Para hacer el contador, crearemos nuestro propio Fab de incremento y decremento
- Para el aprendizaje **deshabilitaremos Prettier** para eliminar ruido
- En eslintrc.js añado **rules**

~~~js
module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': 0
  }
};
~~~
-----

## Counter App

- Hagamos un hola mundo. Uso el snippet **rafc** para crear el componente
- Exporto App por defecto
- En React Native no tengo los elementos html. Reemplazo el div por **View**. Lo importo
- El **view es como si fuera un div**. Por defecto tiene un tamaño de **0px**
- Uso el componente **Text** para introducir texto

~~~js
import React from 'react'
import { Text, View } from 'react-native'

const App = () => {
  return (
    <View>
      <Text>Hola mundo!</Text>
    </View>
  )
}

export default App
~~~

- Aparece el hola mundo en pantalla, pequeñito en la esquina superior izquierda (posición 0,0)
- Para estilizar hay varias técnicas
- Uso el atributo **style** y abro un objeto (que me permite introducir JavaScript) en el que introduzco **un objeto literal**
- Ahora, gracias a TypeScript tengo el intellisense
- Son las mismas propiedades de CSS pero **escritas con camelCase**
- El color que pongo de backgroundColor al View ocupa toda la pantalla
- **flex: 1** indica que ocupe todo el espacio disponible que tiene el View.
  - Si no le coloco el **flex: 1** abarcará el tamaño del contenido hijo (en lugar de la pantalla completa, solo la franja del texto)
- Para centrar el texto en medio de la pantalla, uso las propiedades de flex
- Son **muy parecidas** al flexbox tradicional pero es **especial de React Native**

~~~js
import React from 'react'
import { Text, View } from 'react-native'

const App = () => {
  return (
    <View style={{
      flex: 1,
      backgroundColor: 'orange',
      justifyContent: 'center'
    }}>
      <Text style={{
        fontSize:50,
        textAlign: 'center'
        }}>
        Hola mundo!</Text>
    </View>
  )
}

export default App
~~~

### Resumen

- Etiquetas **View** y **Text**
- Atributo **style** y **propiedades en camelCase**
- **flex** de React Native

------

## Crear pantallas independientes

- App será nuestro punto de entrada de la aplicación. En teoría es el segundo, porque el primero es index.js
- En index.js está la importación de App, por eso cambiar la importación por defecto 
- Creo la carpeta de **src** y dentro **screens** (es un standard)
- Creo el componente HolaMundoScreen.tsx y copio el código que había escrito en App

~~~js
import React from 'react'
import { Text, View } from 'react-native'

export const HolaMundoScreen = () => {
  return (
    <View style={{
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize:50,
          textAlign: 'center'
          }}>
          Hola mundo!</Text>
      </View>
  )
}
~~~

### Resumen

- Crear las carpetas **src** y **screens**
- Crear componente
------

## Crear un contador

- Creo el componente con unos estilos básicos
- Si quiero mover un poco hacia arriba el texto en la pantalla, puedo ponerle position relative, y usar el top con -10 para subirlo 10 unidades
  - O también usar bottom 10

~~~js
import React from 'react'
import { Text, View } from 'react-native'

export const ContadorScreen = () => {
  return (
    <View style={{
        flex:1,
        backgroundColor: 'red',
        justifyContent: 'center'
    }}>

        <Text style={{
            textAlign:'center',
            fontSize: 40,
            position: 'relative',
            bottom: 100
        }}>Contador: xxxx</Text>

    </View>
  )
   }
~~~

- **Por defecto todos los componentes en react Native tienen el position relative**, con lo cual no es necesario ponerlo
- **No tenemos** el position **fixed**
- Para cambiar algo en pantalla debemos manejar el estado, usaremos **useState**
- **No hay tantos componentes disponibles** en React Native. Puedes ver un listado en la documentación oficial
- Dos de ellos son Button y Switch (para valores booleanos)
- Para lo que se necesite se pueden crear nuevos o usar paquetes de terceros disponibles
- En el componente Button tengo los atributos onPress, title, color, accesibilityLabel
- No tiene etiqueta de apertura y cierre, me pide obligatoriamente los atributos **título** y **onPress**
- Se recomienda no usar el Button (tiene pocas opciones) si no **TouchableOpacity/TouchableHighlight/TouchableWithoutFeedback**
  - Estos tres básicamente son lo mismo, lo único que hacen es cambiar la opacidad

~~~js
import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={{
        flex:1,
        backgroundColor: 'red',
        justifyContent: 'center'
    }}>

        <Text style={{
            textAlign:'center',
            fontSize: 40,
            position: 'relative',
            bottom: 100
        }}>Contador: {contador} </Text>

        <Button 
        title= "+1"
        onPress={()=>setContador(contador +1)}  
        />

    </View>
  )
   }
~~~

- setContador(contador++) **no funciona**, porque lo que se intenta es **cambiar el valor de una constante**
- Con contador + 1 lo que se manda al setContador es la expresión

### Resumen:

- Position relative **por defecto** de todos los componentes
- Atributos **title** y **onPress** obligatorios en **Button**. Tiene otros dos: color y accesibiltyLabel
- **No hay muchos** componentes "de fábrica" en React Native. Se pueden crear o usar paquetes de terceros
- **No se recomienda el Button** si no **TouchableOpacity/TouchableHighlight/TouchableWithoutFeedback**
--------

## TouchableOpacity

- Uso el TouchableOpacity
- Puedo colocarle otros elementos como **un View que puedo personalizar** y añadir un **Text**
- Tiene atributos como el onClick

~~~js
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={{
        flex:1,
        backgroundColor: 'red',
        justifyContent: 'center'
    }}>

        <Text style={{
            textAlign:'center',
            fontSize: 40,
            position: 'relative',
            bottom: 100
        }}>Contador: {contador} </Text>

    <TouchableOpacity 
    onPress={()=>setContador(contador+1)}
    >
      <View style={{backgroundColor: 'purple', borderRadius: 100}}>
        <Text style={{textAlign:'center'}}>+1</Text>
      </View>
    </TouchableOpacity>

    </View>
  )
   }
~~~

### Resumen:

- Puedo colocar un **View dentro del TouchableOpacity** y aplicarle estilos
- Siempre que quiero colocar un texto **debo usar Text**
-------

## StyleSheet

- Vamos a crear una hoja de estilos para no cargar los componentes y reutilizar los estilos para evitar la rerenderización del elemento
- **StyleSheet es una abstracción** de lo comúnmente usado en CSS
- Debo importarlo para crear la instancia. Usualmente se crea al final del componente
- Creo el objeto **styles** con **StyleSheet.create** y dentro objetos con propiedades CSS al estilo JavaScript (camelCase)
- Ahora, **con solo unas llaves** dentro de styles (no dos) coloco styles.container

~~~js
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={styles.container}>

        <Text style={{
            textAlign:'center',
            fontSize: 40,
            position: 'relative',
            bottom: 100
        }}>Contador: {contador} </Text>

    <TouchableOpacity 
    onPress={()=>setContador(contador+1)}
    >
      <View style={{backgroundColor: 'purple', borderRadius: 100}}>
        <Text style={{textAlign:'center'}}>+1</Text>
      </View>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  
  container:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'red'
  }
})
~~~

- Hago lo mismo con los demás
- Se pueden agregar varios estilos con comas (styles.algo, styles.otraCosa)

~~~js
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={styles.container}>

        <Text style={styles.title}>
          Contador: {contador} 
        </Text>

    <TouchableOpacity 
    onPress={()=>setContador(contador+1)}
    >
      <View style={styles.buttonIncrement}>
        <Text style={{textAlign:'center'}}>+1</Text>
      </View>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  
  container:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'red'
  },

  title:{
    textAlign:'center',
    fontSize: 40,
    position: 'relative',
    bottom: 100
  },

  buttonIncrement:{
    backgroundColor: 'purple', 
    borderRadius: 100
  }
})
~~~

### Resumen:

- Creo el objeto **styles** con **StyleSheet.create** para aplicar estilos
- Usualmente **se coloca al final** del componente (fuera de este)
- Dentro uso objetos con propiedades CSS pero al estilo JS (con camelCase) 
- Para usarlo, **uso solo un par de llaves** dentro del atributo style con **style.loquesea**
-------

## Botón personalizado flotante

- En React Native no existe un Fab (Floating Action Button), tipico botón circular de la esquina
- Para centrar el texto y que quede bien uso **alignSelf**, mejor que alignText.
- En el padre puedo usar justifyContent para centrarlo
- Para colocarlo en la pantalla dónde yo quiero lo que tengo que mover es el TouchableOpacity
- Creo el objeto fabLocation  en el StyleSheet y uso el **position absolute**, parecido al fixed, solo que se fija en la posición inicial
- Si le digo **bottom 0** le indico que basado en el padre lo pongo abajo del todo
- Si le pongo **right 0** lo colocará a la derecha del todo. Coloco valores como 25 para dejar un poco de margen

~~~js 
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={styles.container}>

        <Text style={styles.title}>
          Contador: {contador} 
        </Text>

    <TouchableOpacity 
    onPress={()=>setContador(contador+1)}
    style={styles.fabLocation}
    >
      <View style={styles.fab}>
        <Text style={styles.fabText}>+1</Text>
      </View>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  
  container:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'red'
  },

  title:{
    textAlign:'center',
    fontSize: 40,
    position: 'relative',
    bottom: 100,
    color: 'white',
    fontWeight:'600'
  },

  fabLocation:{
    position: 'absolute',
    bottom: 25,
    right: 25
  },
  fab:{
    width: 60,
    height:60,
    borderRadius: 100,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  fabText:{
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center'    
  }
})
~~~

- Para crear otro botón puedo duplicar el código de TouchableOpacity, y creo otro fabLocationLeft
- El inconveniente de escribir código de esta manera es que está creciendo mucho con algo tan sencillo
- Para reutilizar el botón de TouchableOpacity de manera más limpia podriamos **crear un componente con él**


### Resumen:

- Ubicar botón con **position absolute** y **bottom**, **right**, **top**, **left**
- Reutilizar CSS
-------

## Creando un Fab (Floating Action Button)

- Para reutilizar el TouchableOpacity (que hace de Fab) vamos a crear el componente
- Puedo poner un **View** en el **return pero también un Fragment**. Copio y pego el TouchableOpacity dentro del return
  - Resulevo las dependencias
- Uso el snippet personalizado stles para crear la StyleSheet (luego se verá como crearlo)
- Copio y pego los estilos
- La etiqueta (+1,-1) la hago personalizables a través de las **props**
- Al trabajar con TypeScript hay que **crear la ineterface** para trabajar con props

~~~js
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


interface Props{
    title: string
}

export const Fab = (props: Props) => {
  return (
     <TouchableOpacity 
    onPress={()=>console.log('click')}
    style={styles.fabLocation}
    >
      <View style={styles.fab}>
        <Text style={styles.fabText}>{props.title} </Text>
      </View>
    </TouchableOpacity>
    
  )
}

const styles = StyleSheet.create({
  
    fabLocation:{
      position: 'absolute',
      bottom: 25,
      right: 25
    },
    fab:{
      width: 60,
      height:60,
      borderRadius: 100,
      justifyContent: 'center',
      backgroundColor: 'black'
    },
    fabLocationL:{
      position: 'absolute',
      bottom: 25,
      left: 25
    },
    fabText:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center'    
    }
  })
~~~

- Puedo desestructurar el title de las props para no escribir props.title
- Para pasarle el setState uso el standard **onPress** como prop
- Lo declaro en la interface
- Se acostumbra en las interfaces que las propiedades vayan arriba y los métodos abajo
- Para la posición le voy a indicar que por defecto se sitúe abajo a la derecha, pero también la posibilidad de indicarle dónde quiero el Fab
  - Defino la propiedad **position** en la interface
  - Le indico que pueden ser dos: bottom-right(br) o bottom-left(bl)
  - Cómo quiero que sea **opcional** le pongo **?** a position
  - Podría usar un ternario para aplicar los estilos

~~~js
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


interface Props{
    title: string,
    position?: 'br' | 'bl'
    onPress: ()=> void,
}
                                    //por defecto el botón se situará abajo a la derecha
export const Fab = ({title,onPress, position= 'br'}: Props) => {
  return (
     <TouchableOpacity 
     style={
        (position === 'br') ? styles.fabLocation : styles.fabLocationL
     }
    onPress={onPress}
    >
      <View style={styles.fab}>
        <Text style={styles.fabText}>{title} </Text>
      </View>
    </TouchableOpacity>
    
  )
}

const styles = StyleSheet.create({
  
    fabLocation:{
      position: 'absolute',
      bottom: 25,
      right: 25
    },
    fabLocationL:{
      position: 'absolute',
      bottom: 25,
      left: 25
    },
    fab:{
      width: 60,
      height:60,
      borderRadius: 100,
      justifyContent: 'center',
      backgroundColor: 'black'
    },
    fabText:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center'    
    }
  })  
~~~

- Para aplicarlo al componente solo tengo que pasarselo como atributos

~~~js
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Fab } from '../components/Fab'

export const ContadorScreen = () => {

  const [contador, setContador] = useState(0)
  return (
    <View style={styles.container}>

        <Text style={styles.title}>
          Contador: {contador} 
        </Text>

    <Fab 
    title="+1"
    onPress={()=>setContador(contador+1)} />
    
    
    <Fab 
    title="-1"
    onPress={()=>setContador(contador-1)} 
    position="bl"/>
    

    </View>
  )
}

const styles = StyleSheet.create({
  
  container:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: 'red'
  },

  title:{
    textAlign:'center',
    fontSize: 40,
    position: 'relative',
    bottom: 100,
    color: 'white',
    fontWeight:'600'
  }

})
~~~

- Se puede usar otra estrategia. En los estilos lo único que cambia es el right y el left
- Puedo crear un único objeto fabLocation con las propiedades comunes, y luego un objeto right y un objeto left en la StyleSheet
- Luego le puedo mandar un arreglo de estilos al componente y evaluar con un ternario

~~~js
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


interface Props{
    title: string,
    position?: 'br' | 'bl'
    onPress: ()=> void,
}

export const Fab = ({title,onPress, position= 'br'}: Props) => {
  return (
     <TouchableOpacity 
     style={[styles.fabLocation, (position === 'br')? styles.right: styles.left]}
    onPress={onPress}
    >
      <View style={styles.fab}>
        <Text style={styles.fabText}>{title} </Text>
      </View>
    </TouchableOpacity>
    
  )
}

const styles = StyleSheet.create({
  
    fabLocation:{
      position: 'absolute',
      bottom: 25,
    },
    right:{
        right:25
    },
    left:{
        left:25
    },
    fab:{
      width: 60,
      height:60,
      borderRadius: 100,
      justifyContent: 'center',
      backgroundColor: 'black'
    },
    fabText:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center'    
    }
  })
~~~

- Para colocarle una sombra al botón le añado la propiedad al estilo del objeto fab en la StyleSheet
- Las sombras en ios y android no funcionan igual
- Una buena herramienta es **ethercreative.github.io/react-native-shadow-generator** para que sean parecidas

~~~js
fab:{
  width: 60,
  height:60,
  borderRadius: 100,
  justifyContent: 'center',
  backgroundColor: 'black',
  shadowColor:"#000",
  shadowOffset:{
    width:0,
    height: 4
  },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 8
},
~~~

- Cuando hago hover en el botón queda bastante feo porque queda cómo translúcido y se ve la sombra de fondo
- Cambio el TouchableOpacity por **TouchableNativeFeedback**
- El problema es que los botones se desubicaron, no me respeta los estilos
- Para solucionarlo lo coloco dentro de un View y le aplico el style al View
- En el TouchableNativeFeedback tengo la propiedad background
- Uso el método Ripple de TouchableNativeFeedback ( que son como las burbujillas) 
  - El primer argumento le paso el color, el borderless, y un tercero opcional que es el radio
  - **NOTA**: para saber los argumentos situar el cursor encima!

~~~js
import React from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'


interface Props{
    title: string,
    position?: 'br' | 'bl'
    onPress: ()=> void,
}

export const Fab = ({title,onPress, position= 'br'}: Props) => {
  return (
    <View style={[styles.fabLocation, (position === 'br')? styles.right: styles.left]}>
        <TouchableNativeFeedback
            onPress={onPress}
            background={TouchableNativeFeedback.Ripple('black', true)}
        >
            <View style={styles.fab}>
                <Text style={styles.fabText}>{title} </Text>
            </View>
    </TouchableNativeFeedback>

    </View>
     
    
  )
}

const styles = StyleSheet.create({
  
    fabLocation:{
      position: 'absolute',
      bottom: 25,
    },
    right:{
        right:25
    },
    left:{
        left:25
    },
    fab:{
      width: 60,
      height:60,
      borderRadius: 100,
      justifyContent: 'center',
      backgroundColor: 'black',
      shadowColor:"#000",
      shadowOffset:{
        width:0,
        height: 4
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8
    },
    fabText:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center'    
    }
  })
~~~

- El efecto de Ripple no está para ios
- Está el objeto Platform, lo importo
- Creo dos funciones, ios y android
- Copio el componente y lo coloco en el return de android
- Para ios cambio el componente  a TouchableOpacity, retiro el view y le aplico los estilos
- Para suavizar un poco el opacity uso la propiedad activeOpacity
- Uso el **Platform** para renderizar uno u otro componente de forma condicional

~~~js
import React from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View, Platform, TouchableOpacity } from 'react-native'


interface Props{
    title: string,
    position?: 'br' | 'bl'
    onPress: ()=> void,
}

export const Fab = ({title,onPress, position= 'br'}: Props) => {

    const ios =()=>{
        return(
            
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.fabLocation, (position === 'br')? styles.right: styles.left]}
            >
                <View style={styles.fab}>
                    <Text style={styles.fabText}>{title} </Text>
                </View>
        </TouchableOpacity>
        )
    }

    const android = ()=>{
        return(
            <View style={[styles.fabLocation, (position === 'br')? styles.right: styles.left]}>
            <TouchableNativeFeedback
                onPress={onPress}
                background={TouchableNativeFeedback.Ripple('black', true)}
            >
                <View style={styles.fab}>
                    <Text style={styles.fabText}>{title} </Text>
                </View>
        </TouchableNativeFeedback>
    
        </View>
        )
    }

  return Platform.OS === "android" ? android() : ios()
}

const styles = StyleSheet.create({
  
    fabLocation:{
      position: 'absolute',
      bottom: 25,
    },
    right:{
        right:25
    },
    left:{
        left:25
    },
    fab:{
      width: 60,
      height:60,
      borderRadius: 100,
      justifyContent: 'center',
      backgroundColor: 'black',
      shadowColor:"#000",
      shadowOffset:{
        width:0,
        height: 4
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8
    },
    fabText:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center'    
    }
  })
~~~

## Resumen:

- Uso las **props** para hacer el componente **reutilizable**
- Renderizo CSS **condicionalmente**, puedo pasarle **un arreglo** de estilos al componente
- Debo **declarar las props en una interface**
  - Cómo standard las propiedades van arriba de la interfaz y los métodos abajo
- Si uso **TouchableNativeFeedback** debo **colocarlo en un View para aplicarle estilos**
  - Tengo la propiedad **background** en la que colocar una expresión de javascript, en este caso Ripple (un método de TouchableNativeFeedback que le dá un efecto al botón al presionarlo)
- Para **renderizar** un componente **de manera distinta** en **ios y android** uso dos funciones y renderizo condicionalmente con el objeto **Platform**
-----

## Apuntes Object Model, Position, Flex

- Para **margin** tenemos
  - marginBottom
  - marginTop
  - marginLeft
  - marginRight
  - marginVertical (arriba y abajo)
  - marginHorizontal (ambos lados)
- Para **padding es lo mismo**
- Para **border** se le añade **Width**
  - borderWidth
  - borderLeftWidth
- El componente **SafeAreaView** sirve para que lo que renderice no choque con el notch
- Rara vez se coloca a nivel de aplicación (en App, nivel superior)
- Para crear el snippet **stles** para crear de una el StyleSheet
- View / Command Palette / user snippets typescriptreact.json
- Creo también el snippet para un componente con un View y un Text dentro
 
~~~json
	"React Native Styles":{

		"Component":{
			"prefix": "rvc",
			"body": [
				"const Component = ()=>{",
				"return (",
				" <View>",
				"     <Text></Text>",
			  	"</View>",
			   	")}"
		]
		},
		"styleSheet":{
			"prefix": "stles",
			"body": [
				"const styles = StyleSheet.create({",
				"      $1",
			 	"});"
		]	
		}
		
	},
~~~

- Uso **flex:1** para que ocupe todo el espacio del padre
- Los padres se adecúan al espacio de sus hijos
- Si coloco flex:1 en un nivel superior (a nivel de aplicación) **ocupará toda la pantalla**
- Es preferible usar un height y un width porcentual y no poner unidades
- Aún mejor es usar **las dimensiones del dispositivo**
  - Con **Dimensions** obtendre las dimensiones del dispositivo fijas
  - Puedo hacer una copia de los estilos y añadir un width porcentual

~~~js
const {height, width} = Dimensions.get('window')

<View
style={{...styles.caja, width: width * 0.2}} //para que ocupe un 20%
> </View>
~~~

- Pero si coloco el móvil **en horizontal**, el **height y el width variarán**
- Para eso está el hook **useWindowDimensions**

~~~js
const {height, width} = useWindowDimensions()
~~~

### Position

- **Por defecto** la position es **relativa**. Si incremento el top la caja bajará
- Solo tenemos **relative** y **absolute**. La absolut **es relativa al padre**
- El **bottom en 0** con **position: absolute** me llevará la caja abajo del todo, porque es relativa al padre
  - Le estoy diciendo que se vaya al final del padre
- Con position relative **los elementos no empujan a otros**. Aunque el otro elemento tenga position absolute, lo solaparía
- Por defecto los elementos se muestran en columna. 
  - Si el primer elemento es absolute y agrego un relative, lo agregará encima. Es como si no tuviera ningún espacio

### Flexbox en React Native

- Creo un View con **flex:1** a nivel de aplicación para que ocupe toda la pantalla
- Creo 3 cajas
  - Si solo le coloco flex:1 a la caja1, ocupará todo el espacio dejando el mínimo posible a caja2 y caja3
  - Si coloco flex:4 a caja1 y caja2 y flex:2 a caja3 ocuparán 40% 40% y 20%
  - Si tengo 2 cajas y a las dos les coloco flex:1 ocuparán 50% y 50%
- **flexDirection** tiene lo de siempre: column, row, column-reverse, row-reverse
- **justifyContent** tiene flex-start por defecto
- Depende si está en column o row trabajará en vertical u horizontal
  - **space-around** deja el mismo espacio entre el borde de la primera caja y la última, equiparando espacios entre las mismas
  - **space-between** equipara distancia entre los elementos
  - **space-evenly** pone la misma distancia entre el borde y los elementos
- **alignItems** tiene **stretch por defecto**, que hará que se estiren los elementos lo más que puedan
  - Tengo flex-end, flex-start, baseline, center
- Con **alignSelf** puedo usar las propiedades de alignItems para que un elemento se situe ignorando al padre
- **flexWrap** se usa para especificar el comportamiento de los elementos cuando estos ocupen más que el contenedor padre