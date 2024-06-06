# REACT NATIVE - Context

- El context es básicamente otro componente
- Para crear el context con TypeScript creo la carpeta context en src con el componente AuthContext.tsx
- Creo el componente y la interfaz con las propiedades que quiero manejar en el state global

~~~js
// Definir cómo luce, qué información tendré aquí
export interface AuthState {
    isLoggedIn: boolean;
    username?: string;
    favoriteIcon?: string;
}
~~~

- Ahora necesito el estado inicial (el estado que necesito cuando la aplicación se lanza)

~~~js
// Estado inicial
export const authInitialState: AuthState = {
    isLoggedIn: false,
    username: undefined,
    favoriteIcon: undefined,
}
~~~

- Para crear el context necesito importar **createContext()**
- Necesito pasarle en un objeto lo que context va a proporcionarle a sus hijos 
- Creo una interfaz para hacerlo

~~~js
// Lo usaremos para decirle a React cómo luce y qué expone el context
export interface AuthContextProps {
    authState: AuthState;
    signIn: () => void;
}

// Crear el contexto
export const AuthContext = createContext( {} as AuthContextProps );
~~~

- Lo siguiente es crear un provider como High Order Component
- Uso **AuthContext.Provider** en el return y le paso el **children** (any) desde las props
- El Provider tiene que proveer un **value** con un objeto con las propiedades **que satisfagan la interfaz de AuthContextProps**

~~~js
// Componente proveedor del estado
export const AuthProvider = ({ children }: any ) => {


    return (
        <AuthContext.Provider value={{
            authState: authInitialState,
            signIn: ()=>{}
        }}>
            { children }
        </AuthContext.Provider>
    )

}
~~~

- Voy al componente padre (App) y allí coloco el provider
- Para mejorar la legibilidad creo otro componente
- Puedes tiparlo con **JSX.Element** o any

~~~js
const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        {/* <StackNavigator /> */}
        {/* <MenuLateralBasico /> */}
        <MenuLateral />
        {/* <Tabs /> */}
      </AppState>
    </NavigationContainer>
  )
}


const AppState = ({ children }: {children: JSX.Element[]} ) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}
~~~
------

## Consumir el context

- Puedo tener varios providers
- Tengo el hook **useContext** para extraer la info del context en cualquier lugar. Debo pasarle el context

~~~js
const {authState, signIn} = useContext(AuthContext)
~~~

- Para trabajar con los estados en el context se suele usar el useReducer (con un switch)
-----

## useReducer

- Un reducer es una función pura. Todo lo que hace lo debe de resolver sin interacciones externas
- No tiene que disparar efectos secundarios, todo lo tiene que resolbver con los argumentos que recibe de entrada y debe generar un nuevo estado
- el reducer siempre recibe dos argumentos, el state y la action
- Siempre tiene que regresar algo de tipo AuthState (la interfaz del state que he creado en el context)
- Genero el tipo AuthAction con las diferentes opciones que quiero manejar


~~~js
import { AuthState } from './AuthContext';

//creo los tipos de las actions. Deberé agregarlos a la interfaz de AuthContextProps para dispararlas con el dispatch!
type AuthAction = 
    | { type: 'signIn' } 
    | { type: 'logout' } 
    | { type: 'changeFavIcon', payload: string }
    | { type: 'changeUsername', payload: string };


// generaEstado
export const authReducer = ( state: AuthState, action: AuthAction ): AuthState => {

    switch ( action.type ) {
        case 'signIn':
            return {
                ...state,
                isLoggedIn: true,
                username: 'no-username-yet'
            }

        case 'logout':
                return {
                    ...state,
                    isLoggedIn: false,
                    username: undefined,
                    favoriteIcon: undefined
                }
    
        case 'changeFavIcon':
            return {
                ...state,
                favoriteIcon: action.payload
            }

        case 'changeUsername':
            return {
                ...state,
                username: action.payload
            }

        default:
            return state;
    }

}
~~~

- Añado a la interfaz de las props del context las acciones que necesito disponibles
- Desestructuro del useReducer el AuthState y el dispatch, pasándole authReducer y el authInitialState
- En el payload le paso el parámetro a cambiar 
- Lo retorno todo dentro del value del Provider

~~~js

import React, { createContext, useReducer } from 'react';
import { authReducer } from './authReducer';


// Definir cómo luce, qué información tendré aquí
export interface AuthState {
    isLoggedIn: boolean;
    username?: string;
    favoriteIcon?: string;
}

// Estado inicial
export const authInitialState: AuthState = {
    isLoggedIn: false,
    username: undefined,
    favoriteIcon: undefined,
}


// Lo usaremos para decirle a React cómo luce y qué expone el context
export interface AuthContextProps {
    authState: AuthState;
    signIn: () => void;
    logout: () => void;
    changeFavoriteIcon: (iconName: string) => void;
    changeUsername: (username: string) => void;
}


// Crear el contexto
export const AuthContext = createContext( {} as AuthContextProps );

// Componente proveedor del estado
export const AuthProvider = ({ children }: any ) => {

    const [ authState, dispatch] = useReducer( authReducer, authInitialState );

    const signIn = () => {
        dispatch({ type: 'signIn' });
    }

    const changeFavoriteIcon = ( iconName: string ) => {
        dispatch({ type: 'changeFavIcon', payload: iconName })
    }

    const logout = () => {
        dispatch({ type: 'logout' });
    }

    const changeUsername = ( username: string ) => {
        dispatch({ type: 'changeUsername', payload: username })
    }

    return (
        <AuthContext.Provider value={{
            authState,
            signIn,
            logout,
            changeFavoriteIcon,
            changeUsername
        }}>
            { children }
        </AuthContext.Provider>
    )

}
~~~

- Ahora tengo un estado global del que puedo extraer si estoy logeado o el username, y dispongo de las funciones del reducer
- Un ejemplo de uso

~~~js
import React, { useContext } from 'react'
import { Text, View, Button } from 'react-native'
import { styles } from '../theme/appTheme';

import { AuthContext } from '../context/AuthContext';

export const ContactsScreen = () => {

    const { signIn, authState } = useContext( AuthContext )
    const { isLoggedIn } = authState;

    return (
        <View style={ styles.globalMargin }>
            <Text style={ styles.title }>ContactsScreen</Text>

            {
                !isLoggedIn && <Button title="SignIn" onPress={ signIn } />
            }
        </View>
    )
}
~~~

- Quiero que al tocar un icono lo guarde como favorito y lo muestre en otra pantalla como mi icono favorito

~~~js
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from '../theme/appTheme';
import { AuthContext } from '../context/AuthContext';

interface Props {
    iconName: string
}


export const TouchableIcon = ({ iconName }: Props ) => {

    const { changeFavoriteIcon } = useContext( AuthContext );

    return (
        <TouchableOpacity
            onPress={ () => changeFavoriteIcon( iconName ) }
        >
            <Icon 
                name={ iconName }
                size={ 80 } 
                color={ colores.primary } />
        </TouchableOpacity>
    )
}
~~~

- Uso el componente en la pantalla con iconos
- Ya no necesito pasarle name, size, solo iconName
- En favoriteIcon del estado global debería guardar el icono que yo hice clic y mostrarlo en otra pantalla

~~~js
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

import { Text, View } from 'react-native'
import { styles, colores } from '../theme/appTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableIcon } from '../components/TouchableIcon';


export const Tab1Screen = () => {

    const { top } = useSafeAreaInsets();

    useEffect(() => {
        console.log('Tab1Screen effect');
    }, [])

    return (
        <View style={{ 
            ...styles.globalMargin,
            marginTop: top + 10
        }}
        >
            <Text style={ styles.title }> Iconos </Text>

            <Text>
                <TouchableIcon iconName="airplane-outline" />
                <TouchableIcon iconName="attach-outline" />
                <TouchableIcon iconName="bonfire-outline" />
                <TouchableIcon iconName="calculator-outline" />
                <TouchableIcon iconName="chatbubble-ellipses-outline" />
                <TouchableIcon iconName="images-outline" />
                <TouchableIcon iconName="leaf-outline" />
            </Text>

        </View>
    )
}
~~~

## Cambiar el icono favorito - AuthState

-  