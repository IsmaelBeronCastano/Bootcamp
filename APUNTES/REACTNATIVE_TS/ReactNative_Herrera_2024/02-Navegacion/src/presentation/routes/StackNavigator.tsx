import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProductScreen } from '../screens/products/ProductScreen';


export type RootstackParams ={
  Home: undefined,
  Product: {id: number, name: string},
  Products: undefined,
  Settings:undefined,
}
const Stack = createStackNavigator<RootstackParams>();

export const StackNavigator=()=> {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,  //false no muestra el header
      headerStyle:{
        elevation: 0, //0 elimina la linea divisoria del header
        shadowColor: 'transparent', //hace que desaparezca en ios

      }
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}