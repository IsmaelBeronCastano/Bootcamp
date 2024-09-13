import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { Category } from '../../Domain/entities/Category';
import { User } from '../../Domain/entities/User';
import { HomeScreen } from '../../../src/Presentation/views/home/Home';
import { RegisterScreen } from '../../../src/Presentation/views/register/Register';
import { ProfileInfoScreen } from '../../../src/Presentation/views/profile/info/ProfileInfo';
import { RolesScreen } from '../../../src/Presentation/views/roles/Roles';
import { AdminTabsNavigator } from '../../../src/Presentation/navigator/AdminTabsNavigator';
import { ClientTabsNavigator } from '../../../src/Presentation/navigator/ClientTabsNavigator';
import { ProfileUpdateScreen } from '../../../src/Presentation/views/profile/update/ProfileUpdate';
import { UserProvider } from '../../../src/Presentation/context/UserContext';
import { AdminCategoryCreateScreen } from '../../../src/Presentation/views/admin/category/create/CategoryCreate';
import { AdminCategoryUpdateScreen } from '../../../src/Presentation/views/admin/category/update/CategoryUpdate';
import { CategoryProvider } from '../../../src/Presentation/context/CategoryContext';
import { DeliveryTabsNavigator } from './DeliveryTabsNavigator';

export type RootStackParamList = {
    HomeScreen: undefined,
    RegisterScreen: undefined,
    RolesScreen: undefined,
    AdminTabsNavigator: undefined,
    ClientTabsNavigator: undefined,
    DeliveryTabsNavigator: undefined,
    ProfileUpdateScreen: {user: User}
  }

const Stack = createNativeStackNavigator<RootStackParamList>();


export const MainStackNavigator = () => {
  return (
    <UserState>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
          />
          
          <Stack.Screen 
            name="RegisterScreen" 
            component={RegisterScreen}
            options={{
              headerShown: true,
              title: 'Nuevo usuario'
            }}  />

        
          <Stack.Screen 
            name="RolesScreen" 
            component={RolesScreen}
            options={{
              headerShown: true,
              title: 'Selecciona un rol'
            }}  />

        
          <Stack.Screen
              name="AdminTabsNavigator"
              component={AdminTabsNavigator}
          />
          
          <Stack.Screen
              name="ClientTabsNavigator"
              component={ClientTabsNavigator}
          />
        
          <Stack.Screen
              name="DeliveryTabsNavigator"
              component={DeliveryTabsNavigator}
          />
          
          <Stack.Screen
              name="ProfileUpdateScreen"
              component={ProfileUpdateScreen}
              options={{
                headerShown: true,
                title: 'Actualizar usuario'
              }}
          />
          
          
        </Stack.Navigator>
      </UserState>
  )
}

const UserState = ({children}: any) => {
    return (
      <UserProvider>
        { children }
      </UserProvider>
    )
  }