import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileScreen } from '../screens/profiles/ProfileScreen';
import { AboutScreen } from '../screens/about/AboutScreen';

const Tab = createMaterialTopTabNavigator();

export const  TopNavigator=()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}