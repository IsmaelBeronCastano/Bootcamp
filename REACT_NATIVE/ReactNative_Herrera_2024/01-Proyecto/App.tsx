import 'react-native-gesture-handler'
import React from 'react';
import { CounterScreen } from './src/presentation/screens/CounterScreen';
import {PaperProvider} from 'react-native-paper'
import IonIcon from 'react-native-vector-icons/Ionicons'

export const App=(): React.JSX.Element=>{

  return(
      <PaperProvider
      settings={({
         icon: (props)=> <IonIcon {...props} />
      })}
      >
         <CounterScreen />
      </PaperProvider>
   )
}





