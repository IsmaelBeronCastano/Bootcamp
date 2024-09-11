import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image, View, Text, TextInput, ToastAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import useViewModel from './ViewModel';
import styles from './Styles';
import { CustomTextInput } from '../../components/CustomTextInput';
import { RootStackParamList } from '../../navigator/MainStackNavigator';
import * as Notifications from 'expo-notifications';
import { NotificationPush } from '../../utils/NotificationPush';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


interface Props extends StackScreenProps<RootStackParamList, 'HomeScreen'>{};

export const HomeScreen = ({navigation, route}: Props) => {

    const { email, password, errorMessage, onChange, login, user, updateNotificationToken } = useViewModel();

    const { notification, notificationListener, responseListener, setNotification, registerForPushNotificationsAsync } = NotificationPush();

    useEffect(() => {
        if (errorMessage !== '') {
            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }
    }, [errorMessage])

    useEffect(() => {      
        if (user?.id !== null && user?.id !== undefined && user?.id !== '') {
            
            registerForPushNotificationsAsync().then(token => {

                console.log('TOKEN: ' + token);

                updateNotificationToken(user?.id!, token!);

                if (user.roles?.length! > 1) {
                    navigation.replace('RolesScreen');
                }
                else {
                    navigation.replace('ClientTabsNavigator');
                }
    
            });
    
            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });
    
            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });
    
            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };
        }
    }, [user])
    
    return (
    // COLUMN
    <View style={styles.container}>
        <Image
            source={ require('../../../../assets/chef.jpg') } 
            style={ styles.imageBackground }
        />

        <View style={ styles.logoContainer }>
            <Image 
                source={ require('../../../../assets/logo.png') }
                style={ styles.logoImage }
            />

            <Text style={ styles.logoText }>FOOD APP</Text>
        </View>

        <View style={ styles.form }>

            <Text style={ styles.formText }>INGRESAR</Text>
            
            <CustomTextInput 
                image={ require('../../../../assets/email.png') }
                placeholder='Correo electronico'
                keyboardType='email-address'
                property='email'
                onChangeText={ onChange }
                value={ email }
            />
        
            <CustomTextInput 
                image={ require('../../../../assets/password.png') }
                placeholder='Contraseña'
                keyboardType='default'
                property='password'
                onChangeText={ onChange }
                value={ password }
                secureTextEntry={ true }
            />

            <View style={{ marginTop: 30 }}>
                
                <RoundedButton text='LOGIN' onPress={ () => login()} />

            </View>

            <View style={ styles.formRegister }>
                <Text>No tienes cuenta?</Text>
                
                <TouchableOpacity onPress={ () => navigation.navigate('RegisterScreen') }>
                    <Text style={ styles.formRegisterText }>Registrate</Text>
                </TouchableOpacity>
                
            </View>

        </View>
        
    </View>
    );
}
    
