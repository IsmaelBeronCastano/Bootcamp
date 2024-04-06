# REACT NATIVE - ACCEDIENDO AL HARDWARE

## Geolocalización

> npm i -S react-native-get-location

- Hay que añadir esto en AndroidManifest.xml en android/app/src para usar HighAccuracy en true

~~~xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
~~~

- Ejemplo de uso
- NOTA: si falla el BUILD con *:react-native-location:compileDebugJavaWithJavac* probar con cd android y

> ./gradlew clean 
> npx jetify

~~~js
const App = ()=>{

  const [coord, setCoord] = useState<any>([])

const obtenerLocalizacion = async()=>{
  const {latitude, longitude} = await GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 6000})
  setCoord([latitude, longitude])
}

useEffect(()=>{
  obtenerLocalizacion()
}, [])
~~~

## Cámara

- Para poder interactuar con la cámara (solo lo permite con un dispositivo físico) habrá que cumplir un par de pasos
  - Debo pedir permisos al usuario para pode acceder
  - Lo segundo serña mostrar la cámara
  - Lo tercero será crear un botón que me permita cambiar de cámara
- useState lo usaremos para guardar qué cámara estamos utilizando, y useEffect para solicitar los permisos
- 



return (
 <View style={styles.container}>
  <Text>{coord}</Text>
</View>
)}
~~~