# 03 REACT NATIVE - FLEX

## Fundamentos

Tenemos:
    - **Box Object Model**: alto, ancho. margin, border 
    - **Position**: absolute, relative, top, left, right, bottom
    - **Flexbox**: dirección, ubicación, alineamiento, estirar, encoger, proporciones

### Box Object Model

- Es el width, el height, el padding, el border, y el margin
- Tenemos 
    - margin
    - marginLeft
    - marginRight
    - marginTop
    - marginBottom
    - marginVertical
    - marginHorizontal

- Lo mismo con el padding
- Con el border es un poco diferente
    - borderWidth
    - borderLeftWidth
- + right, bottom y top

- Para el color uso borderColor: 'color'
- Siempre es el padre quien determina el tamaño
    - Si al padre le pongo un height de 30 y el fontSize del hijo es de 45, las letras se verán cortadas
    - Si el hijo tiene un tamaño relativo, será relativo al padre

- Con **flex:1** toma todo el tamaño posible
- Con el SafeAreaView en App, si coloco un flex:1 en el componente hijo **NO SE VE** porque el SafeAreaView no tiene un tamaño 
- Esto se soluciona dándole un height al SafeAreaView

~~~js
<SafeAreaView style={{height: 500}} >
~~~

- Si aplico un borderWidth **sin un padding** el border de la caja tapará las letras
- El padding hace una separación interna, el margin hace una separación con el padre

### Height, width porcentual y dimensiones de la pantalla

- Los porcentajes son relativos al padre
- Los porcentajes se escriben como string width: '50%'
- Si quiero que la caja tome la mitad de la pantalla indistintamente de lo que mida el padre de ancho
- Puedo usar **Dimensions**

~~~js
import {Dimensions} from 'react-native'

const windowWith = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

//o puedo usar desestructuración

const {width, height} = Dimensions.get('window')
~~~

- Puedo tomar todas las propiedades de CSS que haya escrito en la StyleSheet **usando el operador spread**
- Las propiedades que escriba dentro del objeto se sobreescribirán

~~~js
const {width, height} = Dimensions.get('window')

<View style={{
    ...styles.purplebox,
    width: width * 0.5   //así ocupa la mitad de la pantalla 
}} >
~~~

### Position

- El position puede ser absolute o relative 
- La position por defecto es relative (al padre)
- Inclusive cuando es absolute es relative al padre
- Con **position relative** el bottom: 0 es en el mismo punto dónde se encuentra
- Si le pongo valores positivos al bottom va a empezar a subir. 
    - Todo es relativo a la posición en la que se encuentra la caja
    - Si tiene otra caja no la empujará al moverlo, pero si al colocarlas inicialmente en su construcción
    - Se verá según el orden en el que fueron construidos (se solaparán)
    - Por defecto se colocan en columna
- Con **position absolute** el bottom: 0 es relativo al padre, es decir, iría abajo del todo al bottom del padre a la izquierda
    - Por defecto el left es 0.
    - Si tenemos dos elementos y el primero tiene el position en absolute, es como si no ocupara un espacio.
    - Es decir, que el segundo elemento se colocará encima
    - Puedo usar el absolute para colocar la caja donde quiera relativa al padre indistintamente usando top: 0, right: 0, etc
-----

## Flexbox en React Native

- Puedo usar varios Views y distribuir el espacio con flex:1, flex:2, flex:3, donde flex:1 = 1/6, flex:2 = 2/6, y flex:3 = 3/6
- Tenemos en **direcciones**: column, row, column-reverse y row-reverse
- En **justifyContent** tenemos: flex-start, flex-end, center, space-between, space-around, space-evenly
- En **alignItems** tenemos: stretch (por defecto, similar al auto), flex-start, flex-end, center, baseline (se usa poco)
- El eje de justifyContent y alignItems varia si estoy en row o column
- **alignSelf**: es un alineamiento que le damos a un objeto en particular sobreescribiendo el del padre. Son los mismos que alignItems
- **alignContent** funciona igual que el justifyContent pero en el eje vertical en el caso de estar en row
- **flexWrap**: limita los objetos al espacio disponible
- **flexBasis, Grow and Shrink**: como quieres que se estire, que se encoja
- **Row Gap, Column Gap and Gap**: añade espacios
------

## Tips

- Si pongo alignItems en stretch (estando en row) y quiero que se estiren en su totalidad verticalmente, le quito el height al objeto
- Si le quito el width desaparecen
- Para que cada caja ocupe el máximo disponible de alto y ancho pongo flex: 1
- Con alignSelf (estando en row) si quiero que uno de los elementos esté en el bottom, puedo usar flex-end
- Con alignSelf sigue siendo vigente la dirección. Si cambio a row-reverse se invertirán
- Con flexWrap los objetos se alinearán en una fila o columna siguiente. Tengo 'wrap' y 'no-wrap'
    - Usándolo conjuntamente con el gap se crea un grid
    - Tengo gap, columnGap y rowGap

