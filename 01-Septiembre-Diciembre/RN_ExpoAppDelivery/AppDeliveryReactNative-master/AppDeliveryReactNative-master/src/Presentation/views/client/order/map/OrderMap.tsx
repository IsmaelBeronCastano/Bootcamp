import React, { useEffect } from 'react'
import { View, Text, ToastAndroid, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RoundedButton } from '../../../../components/RoundedButton';
import styles from './Styles';
import useViewModel from './ViewModel';
import stylesMap from './StylesMap';
import { StackScreenProps } from '@react-navigation/stack';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../../contants/GoogleMapApiKey';
import { ClientOrderStackParamList } from '../../../../navigator/ClientOrderStackNavigator';

interface Props extends StackScreenProps<ClientOrderStackParamList, 'ClientOrderMapScreen'>{};
export const ClientOrderMapScreen = ({navigation, route}: Props) => {
    
    const { order } = route.params;
    const { messagePermissions, position, socket, responseMessage, mapRef, origin, positionOnce } = useViewModel(order);

    useEffect(() => {
      if (messagePermissions != '') {
        ToastAndroid.show(messagePermissions, ToastAndroid.LONG);
      }
    }, [messagePermissions])

    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        console.log('EVENTO: beforeRemove');
        socket.disconnect();
      });
    
      return unsubscribe;
    }, [navigation])

    useEffect(() => {
      if (responseMessage !== '') {
        ToastAndroid.show(responseMessage, ToastAndroid.LONG);
      }
    }, [responseMessage])
    
    
    return (
        <View style={styles.container}>
            <MapView 
                ref={ mapRef }
                customMapStyle={ stylesMap }
                zoomControlEnabled={true}
                style={{ height: '71%', width: '100%', position: 'absolute', top: 0 }}
                provider={PROVIDER_GOOGLE}
            >
                {
                    position.latitude !== 0.0 &&
                    <Marker 
                        coordinate={position}
                    >
                        <Image 
                            style={styles.markerImage}
                            source={require('../../../../../../assets/delivery.png')}
                        />
                    </Marker>
                }
                {
                    order.address !== undefined &&
                    <Marker 
                        coordinate={{ latitude: order.address.lat, longitude: order.address.lng }}
                    >
                        <Image 
                            style={styles.markerImage}
                            source={require('../../../../../../assets/home.png')}
                        />
                    </Marker>
                }
                {
                    (origin.latitude !== 0.0 && positionOnce.latitude !== 0.0) &&
                    <MapViewDirections
                        origin={origin}
                        destination={positionOnce}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={5}
                        strokeColor="orange"
                    />
                }
                
                
            </MapView>
            
            <View style={ styles.info }>

                <View style={ styles.infoRow }>
            
                    <View style={styles.infoText}>
                        <Text style={styles.infoTitle}>Barrio</Text>
                        <Text style={styles.infoDescription}>{order.address?.neighborhood}</Text>
                    </View>

                    <Image 
                        style={ styles.infoImage }
                        source={require('../../../../../../assets/location.png')}
                    />

                </View>
                
                <View style={ styles.infoRow }>
            
                    <View style={styles.infoText}>
                        <Text style={styles.infoTitle}>Direccion</Text>
                        <Text style={styles.infoDescription}>{order.address?.address}</Text>
                    </View>

                    <Image 
                        style={ styles.infoImage }
                        source={require('../../../../../../assets/location_home.png')}
                    />

                </View>

                <View style={styles.divider}></View>

                <View style={ styles.infoClient }>
                    <Image 
                        style={styles.imageClient}
                        source={{uri: order.delivery?.image}}
                    />
                    <Text style={ styles.nameClient }>{order.delivery?.name} {order.delivery?.lastname}</Text>
                    <Image 
                        style={styles.imagePhone}
                        source={require('../../../../../../assets/phone.png')}
                    />
                </View>

                
            </View>
            
            <TouchableOpacity style={ styles.backContainer } onPress={() => navigation.goBack()}>

                <Image 
                    style={styles.back}
                    source={require('../../../../../../assets/back.png')}
                />
            </TouchableOpacity>
        </View>
    )
}
