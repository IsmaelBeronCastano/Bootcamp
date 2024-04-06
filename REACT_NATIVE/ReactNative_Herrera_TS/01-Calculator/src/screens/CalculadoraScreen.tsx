import { Button, Text, View } from "react-native"
import { styles } from "../themes/AppTheme"
import { BotonCalc } from "../components/BotonCalc"
import { useState } from "react"


export const CalculadoraScreen = ()=>{

    const [numeroAnterior, setNumeroAnterior] = useState('0')
    const [numero, setNumero] = useState('0')

    const limpiar =()=>{
        setNumero('0')
    }

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

    const positivoNegativo = ()=>{
        if(numero.includes('-')){
            setNumero(numero.replace('-',''))
        }else{
            setNumero('-'+ numero)
        }
    }

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



return (
 <View style={styles.calculadoraContainer}>
     <Text style={styles.resultadoPequeno}>{numeroAnterior}</Text>
     <Text style={styles.resultado}
        numberOfLines={1}
        adjustsFontSizeToFit
     >{numero}</Text>

    <View style={styles.fila}>
        <BotonCalc texto="C" color="#9B9B9B"
                    accion={limpiar} />
        <BotonCalc texto="+/-" color="#9B9B9B" accion={positivoNegativo}/>
        <BotonCalc texto="del" color="#9B9B9B" accion={btnDelete}/>
        <BotonCalc texto="/" color="#FF9427" accion={limpiar}/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="7" accion={armarNumero} />
        <BotonCalc texto="8" accion={armarNumero}/>
        <BotonCalc texto="9" accion={armarNumero}/>
        <BotonCalc texto="X" color="#FF9427" accion={limpiar}/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="4" accion={armarNumero}/>
        <BotonCalc texto="5" accion={armarNumero}/>
        <BotonCalc texto="6" accion={armarNumero}/>
        <BotonCalc texto="-" color="#FF9427" accion={limpiar}/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="1" accion={armarNumero}/>
        <BotonCalc texto="2" accion={armarNumero}/>
        <BotonCalc texto="3" accion={armarNumero}/>
        <BotonCalc texto="+" color="#FF9427" accion={limpiar}/>
    </View>
    <View style={styles.fila}>
        <BotonCalc texto="0" ancho accion={armarNumero} />
        <BotonCalc texto="."accion={armarNumero}/>
        <BotonCalc texto="=" color="#FF9427"accion={limpiar}/>
    </View>

</View>
)}



