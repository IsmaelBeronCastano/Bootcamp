import React from 'react'
import { StyleSheet, View, Image, Text } from 'react-native';
import { Product } from '../../../../../Domain/entities/Product';

interface Props {
    product: Product
}
export const OrderDetailItem = ({ product }: Props) => {
  return (
    <View style={ styles.container }>
        <Image
            source={{ uri: product.image1 }}
            style={ styles.image }
        />

        <View style={styles.productInfo}>
            <Text style={ styles.name }>{ product.name }</Text>
            <Text style={ styles.quantity }>Cantidad: { product.quantity }</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 15
    },
    productInfo: {
        marginLeft: 15
    },
    name: {
        fontWeight: 'bold'
    },
    quantity: {
        fontSize: 13,
        marginTop: 5
    }
})
