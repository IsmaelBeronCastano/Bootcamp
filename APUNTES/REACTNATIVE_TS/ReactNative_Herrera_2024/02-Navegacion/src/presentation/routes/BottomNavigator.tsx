import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tab1Screen } from '../screens/tabs/Tab1Screen';
import { Tab3Screen } from '../screens/tabs/Tab3Screen';
import { Text } from 'react-native';
import {TopNavigator} from '../routes/TopNavigator'
import { StackNavigator } from './StackNavigator';
import IconComponent from '../components/shared/IconComponent';
const Tab = createBottomTabNavigator();

export const BottomNavigator=()=> {
  return (
    <Tab.Navigator
    sceneContainerStyle={{
        backgroundColor: 'rgba(241, 237, 231, 0.2)',
    }}
    screenOptions={{
        //headerShown: false,
        tabBarLabelStyle:{
            marginBottom: 5
        },
        headerStyle: { //eliminar la linea 
            elevation: 0,
            borderColor: 'transparent',
            shadowColor: 'transparent'
        },
        tabBarStyle:{ //para eliminar la linea en ios
            borderTopWidth: 0,
            elevation: 0
        }

    }}
    >
      <Tab.Screen name="Tab1" options={{title: "Tab1", tabBarIcon: ()=><IconComponent name="airplane" size={30} color="orange" /> }} component={StackNavigator} />
      <Tab.Screen name="Tab2"  options={{title: "Tab2", tabBarIcon: ()=><IconComponent name="alarm" size={30} color="orange" /> }} component={TopNavigator} />
      <Tab.Screen name="Tab3" options={{title: "Tab3", tabBarIcon:()=><IconComponent name="bicycle" size={30} color="orange" /> }}  component={Tab3Screen} />
    </Tab.Navigator>
  );
}