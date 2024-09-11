import { StyleSheet } from "react-native";

const ClientAddressMapStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageLocation: {
        height: 65,
        width: 65,
        justifyContent: 'center',
        position: 'absolute'
    },
    refPoint: {
        position: 'absolute',
        backgroundColor: '#d4d4d4',
        width: '70%',
        paddingVertical: 4,
        top: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    refPointText: {
        textAlign: 'center',
        
    },
    buttonRefPoint: {
        position: 'absolute',
        bottom: 40,
        width: '70%'
    }
});

export default ClientAddressMapStyles;