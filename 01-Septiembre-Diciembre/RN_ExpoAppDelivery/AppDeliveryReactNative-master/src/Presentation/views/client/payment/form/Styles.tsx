import { StyleSheet } from "react-native";

const ClientPaymentFormStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    form: {
        marginTop: 15,
        // flex: 1
    },
    buttonContainer: {
        width: '100%',
        padding: 20,
        alignSelf: 'flex-end'
    },
    dropdown: {
        marginHorizontal: 20,
        marginTop: 30,
        flex: 1
    },
    check: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
    }
});

export default ClientPaymentFormStyles;