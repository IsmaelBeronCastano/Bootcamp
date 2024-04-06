import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, FlatList} from 'react-native'
import  {Input, List, Map, Modal, Panel}  from './src/Components'


type coords ={latitude: number, longitude: number}

export interface Puntos{
  nombre?: string 
  coordinate: coords | undefined
}

enum Filter {
  new_Punto = "new_Punto",
  all_Puntos = "all_Puntos"
}


const App = () => {


  const [visibility, setVisibility] = useState<boolean>(false) //visibilidad del modal

  const [puntos, setPuntos] = useState<Puntos[]>([])

  const [nombre, setNombre] =useState<string>("")

  const [puntoTemp, setPuntoTemp] = useState<coords>()

  const [visibilityFilter, setVisibilityFilter] = useState<Filter>(Filter.new_Punto)


  const handleLongPress = ({nativeEvent}: any)=>{

    const newCoord= {...nativeEvent.coordinate as coords}
    
    setVisibilityFilter(Filter.new_Punto) 
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
  }

const handleLista =()=>{
    setVisibilityFilter(Filter.all_Puntos)
    setVisibility(true)
  }

  const handleMostrarOcultar =()=>{
    console.log("mostrar/ocultar")
  }

  return ( 

    <View style={styles.container}>
     <Map onLongPress ={handleLongPress} />
     <Modal visibility={visibility}>
    {visibilityFilter === "new_Punto"
      ? 
      <>
      <Input title="Nombre" placeholder="Nombre del punto" onChangeText={handleOnChangeText} />
      <Button title="Aceptar" onPress={handleSubmit} />
       </> 
       : <List puntos={puntos}  />} 
     </Modal>
       <Panel onPressLeft={handleLista} onPressRight={handleMostrarOcultar} textLeft="Listar" textRight="Mostrar/Ocultar"/>
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