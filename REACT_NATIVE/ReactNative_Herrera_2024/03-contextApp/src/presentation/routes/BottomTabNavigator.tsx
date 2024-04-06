import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreens';
import Settingsscreen from '../screens/settings/Settingsscreen';
import { ProfileScreen } from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator=()=>{
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={Settingsscreen} />
    </Tab.Navigator>
  );
}