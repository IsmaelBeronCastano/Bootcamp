import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Product } from '../../../../Domain/entities/Product';

interface Props {
    product: Product,
    addItem: (product: Product) => void,
    subtractItem: (product: Product) => void,
    deleteItem: (product: Product) => void,
}

export const ShoppingBagItem = ({product, addItem, subtractItem, deleteItem}: Props) => {
  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image 
                style={styles.image}
                source={{uri: product.image1}}
            />
        </View>
        <View style={styles.productInfo}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.quantity! * product.price}</Text>
            </View>

            <View style={styles.productActions}>
                <View style={styles.actions}>
                    <TouchableOpacity 
                        onPress={() => subtractItem(product)}
                        style={styles.actionLess}
                    >
                        <Text style={styles.actionText}>-</Text>
                    </TouchableOpacity>
                    
                    <View style={ styles.quantity }>
                        <Text style={styles.actionText}>{ product.quantity }</Text>
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => addItem(product)}
                        style={styles.actionAdd}
                    >
                        <Text style={styles.actionText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => deleteItem(product)}>
                    <Image
                        style={styles.deleteItem}
                        source={require('../../../../../assets/trash.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 7
    },
    imageContainer: {

    }, 
    image: {
        width: 60,
        height: 60,
        borderRadius: 15
    },
    productInfo: {
        flex: 1
    },
    title: {
        color: 'black',
        fontSize: 14,
        marginLeft: 15,
        flex: 1
    },
    price: {
       marginRight: 40,
       fontWeight: 'bold'
    },
    productActions: {
        flexDirection: 'row',
        marginLeft: 15,
        marginTop: 5,
        marginRight: 45
    },
    actionLess: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10
    },
    actionAdd: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'center',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    },
    actionText: {
        color: 'black',
        fontSize: 15
    },
    quantity: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 5,
        paddingHorizontal: 15,
        alignSelf: 'center',
    },
    actions: {
        flexDirection: 'row',
        flex: 1
    },
    deleteItem: {
        width: 25,
        height: 25
    }
});
