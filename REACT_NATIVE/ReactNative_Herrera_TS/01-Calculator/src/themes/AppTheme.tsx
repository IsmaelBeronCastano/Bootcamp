import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    fondo:{
        flex:1,
        backgroundColor: 'black',
    },
    calculadoraContainer:{
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'flex-end'
    },
    resultado:{
        color: 'white',
        fontSize: 60,
        textAlign: 'right',
        marginBottom: 20
    },
    resultadoPequeno:{
        color: 'rgba(255,255,255,0.4)',
        fontSize: 40,
        textAlign: 'right',
    },
    fila:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 10,
        marginHorizontal: -20
    }

})

