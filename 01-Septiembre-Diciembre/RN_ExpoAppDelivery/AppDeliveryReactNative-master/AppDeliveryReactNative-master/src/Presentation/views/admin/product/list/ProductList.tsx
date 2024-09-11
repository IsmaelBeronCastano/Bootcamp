import React, { useEffect } from 'react'
import { View, Text, FlatList, ToastAndroid } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductStackParamList } from '../../../../navigator/AdminProductNavigator';
import useViewModel from './ViewModel';
import { AdminProductListItem } from './Item';

interface Props extends StackScreenProps<ProductStackParamList, 'AdminProductListScreen'>{};
export const AdminProductListScreen = ({navigation, route}: Props) => {

    const {category} = route.params;
    const { products, responseMessage, getProducts, deleteProduct } = useViewModel();
    
    useEffect(() => {
      if (category.id !== undefined) {
        getProducts(category.id!);
      }
    }, [])

    useEffect(() => {
      if (responseMessage !== '') {
        ToastAndroid.show(responseMessage, ToastAndroid.LONG);
      }
    }, [responseMessage])
    
    
    
    return (
      <View style={{backgroundColor: 'white'}}>
          <FlatList
            data={ products }
            keyExtractor={(item) => item.id!}
            renderItem={ ({item}) => <AdminProductListItem product={item} remove={ deleteProduct } category={category} /> }
            />
      </View>
    )
}
