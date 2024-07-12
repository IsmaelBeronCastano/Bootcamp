import 'react-native-gesture-handler'
import React from 'react';
import {PaperProvider} from 'react-native-paper'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { HomeScreen } from './presentation/screens/home/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './presentation/navigator/StackNavigator';

export const ComponentsApp=(): React.JSX.Element=>{

  return(
      <NavigationContainer>
      <PaperProvider
      settings={({
         icon: (props)=> <IonIcon {...props} />
      })}
      >
         <StackNavigator />
         
      </PaperProvider>
      </NavigationContainer>

   )
}







