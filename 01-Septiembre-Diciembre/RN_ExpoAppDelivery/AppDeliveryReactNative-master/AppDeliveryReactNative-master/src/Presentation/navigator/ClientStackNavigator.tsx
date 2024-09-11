import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientCategoryListScreen } from '../views/client/category/list/CategoryList';
import { ClientProductListScreen } from '../views/client/product/list/ProductList';
import { ClientProductDetailScreen } from '../views/client/product/detail/ProductDetail';
import { Product } from '../../Domain/entities/Product';
import { ShoppingBagProvider } from '../context/ShoppingBagContext';
import { TouchableOpacity, Image } from 'react-native';
import { ClientShoppingBagScreen } from '../views/client/shopping_bag/ShoppingBag';
import { ClientAddressListScreen } from '../views/client/address/list/AddressList';
import { ClientAddressCreateScreen } from '../views/client/address/create/AddressCreate';
import { ClientAddressMapScreen } from '../views/client/address/map/AddressMap';
import { ClientPaymentFormScreen } from '../views/client/payment/form/PaymentForm';
import { ClientPaymentInstallmentsScreen } from '../views/client/payment/installments/PaymentInstallments';
import { ResponseMercadoPagoCardToken } from '../../Data/sources/remote/models/ResponseMercadoPagoCardToken';
import { ClientPaymentStatusScreen } from '../views/client/payment/status/PaymentStatus';
import { ResponseMercadoPagoPayment } from '../../Data/sources/remote/models/ResponseMercadoPagoPayment';

export type ClientStackParamList = {
    ClientCategoryListScreen: undefined,
    ClientProductListScreen: {idCategory: string},
    ClientProductDetailScreen: {product: Product},
    ClientShoppingBagScreen: undefined,
    ClientAddressListScreen: undefined,
    ClientAddressCreateScreen: { refPoint: string, latitude: number, longitude: number } | undefined,
    ClientAddressMapScreen: undefined,
    ClientPaymentFormScreen: undefined,
    ClientPaymentInstallmentsScreen: { cardToken: ResponseMercadoPagoCardToken },
    ClientPaymentStatusScreen: { paymentData: ResponseMercadoPagoPayment },
}

const Stack = createNativeStackNavigator<ClientStackParamList>();

export const ClientStackNavigator = () => {
  return (
    <ShoppingBagState>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
            name='ClientCategoryListScreen'
            component={ ClientCategoryListScreen }
            options={ ({route, navigation}) => (
              {
                headerShown: true,
                title: 'Categorias',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('ClientShoppingBagScreen')}>
                    <Image 
                      source={ require('../../../assets/shopping_cart.png') }
                      style={{ width:30, height: 30 }}
                    />
                  </TouchableOpacity>
                )
              }
            )}
        />
        
        <Stack.Screen 
            name='ClientProductListScreen'
            component={ ClientProductListScreen }
            options={ ({route, navigation}) => (
              {
                headerShown: true,
                title: 'Productos',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('ClientShoppingBagScreen')}>
                    <Image 
                      source={ require('../../../assets/shopping_cart.png') }
                      style={{ width:30, height: 30 }}
                    />
                  </TouchableOpacity>
                )
              }
            )}
              
        />
        
        <Stack.Screen 
            name='ClientProductDetailScreen'
            component={ ClientProductDetailScreen }
        />

        <Stack.Screen 
            name='ClientShoppingBagScreen'
            component={ ClientShoppingBagScreen }
            options={{
              title: 'Mi orden',
              headerShown: true
            }}
        />
       
        <Stack.Screen 
            name='ClientAddressListScreen'
            component={ ClientAddressListScreen }
            options={ ({route, navigation}) => (
              {
                headerShown: true,
                title: 'Mis Direcciones',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('ClientAddressCreateScreen')}>
                    <Image 
                      source={ require('../../../assets/add.png') }
                      style={{ width:30, height: 30 }}
                    />
                  </TouchableOpacity>
                )
              }
            )}
        />

        <Stack.Screen 
          name='ClientAddressCreateScreen'
          component={ ClientAddressCreateScreen }
          options={{
            title: 'Nueva direccion',
            headerShown: true
          }}
        />
       
        <Stack.Screen 
          name='ClientAddressMapScreen'
          component={ ClientAddressMapScreen }
          options={{
            title: 'Ubica tu direccion en el mapa',
            headerShown: true
          }}
        />
        
        <Stack.Screen 
          name='ClientPaymentFormScreen'
          component={ ClientPaymentFormScreen }
          options={{
            title: 'Formulario de pago',
            headerShown: true
          }}
        />
        
        <Stack.Screen 
          name='ClientPaymentInstallmentsScreen'
          component={ ClientPaymentInstallmentsScreen }
          options={{
            title: 'Numero de coutas',
            headerShown: true
          }}
        />
        
        <Stack.Screen 
          name='ClientPaymentStatusScreen'
          component={ ClientPaymentStatusScreen }
        />

      </Stack.Navigator>   
    </ShoppingBagState>
  )
}

const ShoppingBagState = ({children}: any) => {
    return (
        <ShoppingBagProvider>
            {children}
        </ShoppingBagProvider>
    )
}