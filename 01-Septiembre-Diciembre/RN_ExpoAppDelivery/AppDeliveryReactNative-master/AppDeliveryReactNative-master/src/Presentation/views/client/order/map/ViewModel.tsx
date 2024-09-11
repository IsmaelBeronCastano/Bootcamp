import * as Location from 'expo-location'
import React, { useEffect, useState, useRef, useContext } from 'react'
import MapView, { Camera } from 'react-native-maps';
import { StackScreenProps } from '@react-navigation/stack';
import { DeliveryOrderStackParamList } from '../../../../navigator/DeliveryOrderStackNavigator';
import { Order } from '../../../../../Domain/entities/Order';
import { OrderContext } from '../../../../context/OrderContext';
import socket from '../../../../utils/SocketIO';

const ClientOrderMapViewModel = (order: Order) => {
    
    const [messagePermissions, setMessagePermissions] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [refPoint, setRefPoint] = useState({
        name: '',
        latitude: 0.0,
        longitude: 0.0,
    });
    const [position, setPosition] = useState({
        latitude: 0.0,
        longitude: 0.0
    })
    const [origin, setOrigin] = useState({
        latitude: order.address?.lat!,
        longitude: order.address?.lng!
    });
    
    const [positionOnce, setPositionOnce] = useState({
        latitude: 0.0,
        longitude: 0.0
    })
    const mapRef = useRef<MapView | null>(null);
    let positionSuscription: Location.LocationSubscription;
    const { updateToDelivered } = useContext(OrderContext);

    useEffect(() => {
      if (position.latitude !== 0.0 && position.longitude !== 0.0) {
        if (positionOnce.latitude === 0.0 && positionOnce.longitude === 0.0) {
            setPositionOnce(position);
        }
      }
    }, [position])
    

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            console.log('------------- SOCKET IO CONNECTION ---------------');
        });
        socket.on(`position/${order.id!}`, (data: any) => {
            setPosition({latitude: data.lat, longitude: data.lng});
        })
        const requestPermissions = async () => {
            const foreground = await Location.requestForegroundPermissionsAsync();

            if (foreground.granted) {
                startForegroundUpdate();
            }
        }

        requestPermissions();

    }, [])

    
    const startForegroundUpdate = async () => {
        const { granted } = await Location.getForegroundPermissionsAsync(); 

        if (!granted) {
            setMessagePermissions('Permiso de ubicacion denegado')
            return;
        }

        const location = await Location.getLastKnownPositionAsync(); // UBICACION UNA SOLA VEZ
        
        console.log('POSITION: ' + JSON.stringify(location?.coords, null, 3));
        
        const newCamera: Camera = {
            center: { latitude: location?.coords.latitude!, longitude: location?.coords.longitude! },
            zoom: 15,
            heading: 0,
            pitch: 0,
            altitude: 0
        };
        mapRef.current?.animateCamera(newCamera, { duration: 2000 })

    }

    return {
        messagePermissions,
        position,
        mapRef,
        ...refPoint,
        responseMessage,
        origin,
        socket,
        positionOnce
    };
}

export default ClientOrderMapViewModel;