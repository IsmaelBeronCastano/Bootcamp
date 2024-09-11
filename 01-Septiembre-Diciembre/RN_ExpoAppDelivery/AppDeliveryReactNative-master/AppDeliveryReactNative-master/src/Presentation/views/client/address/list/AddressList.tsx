import React, { useEffect } from 'react'
import { View, Text, FlatList, ToastAndroid } from 'react-native';
import { RoundedButton } from '../../../../components/RoundedButton';
import { AddressListItem } from './Item';
import useViewModel from './ViewModel';
import { StackScreenProps } from '@react-navigation/stack';
import { ClientStackParamList } from '../../../../navigator/ClientStackNavigator';

interface Props extends StackScreenProps<ClientStackParamList, 'ClientAddressListScreen'>{};
export const ClientAddressListScreen = ({navigation, route}: Props) => {

  const { address, checked, responseMessage, getAddress, changeRadioValue, createOrder } = useViewModel();

  useEffect(() => {
    if (responseMessage !== '') {
      ToastAndroid.show(responseMessage, ToastAndroid.LONG);
    }
  }, [responseMessage])
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList 
          data={ address }
          keyExtractor={ (item) => item.id! }
          renderItem={ ({item}) => 
            <AddressListItem 
              address={ item } 
              checked={ checked }  
              changeRadioValue={ changeRadioValue }
            /> 
          }
        />

        <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 20 }}>
          {/* <RoundedButton onPress={() => createOrder()} text='CONTINUAR' /> */}
          <RoundedButton onPress={() => navigation.navigate('ClientPaymentFormScreen')} text='CONTINUAR' />
        </View>
    </View>
  )
}
