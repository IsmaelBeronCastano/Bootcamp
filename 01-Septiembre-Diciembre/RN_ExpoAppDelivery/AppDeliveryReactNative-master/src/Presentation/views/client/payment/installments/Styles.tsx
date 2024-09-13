import { StyleSheet } from 'react-native';

const ClientPaymentInstallmentsStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    dropdownContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        flex: 1
    },
    textNumberInstallments: {
        marginHorizontal: 20,
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    loading: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left:0, 
    }
});

export default ClientPaymentInstallmentsStyles;