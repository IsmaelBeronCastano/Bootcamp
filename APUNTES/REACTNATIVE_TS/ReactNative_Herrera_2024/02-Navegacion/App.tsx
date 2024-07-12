import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SideMenuNavigator from './src/presentation/routes/SideMenuNavigator';


export const App=(): React.JSX.Element=> {

  return (
    <NavigationContainer>
        <SideMenuNavigator />
    </NavigationContainer>
  );
}
