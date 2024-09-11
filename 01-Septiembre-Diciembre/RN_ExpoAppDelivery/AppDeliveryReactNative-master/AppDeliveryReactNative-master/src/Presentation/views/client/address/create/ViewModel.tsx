import React, { useState, useContext, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { CategoryContext } from '../../../../context/CategoryContext';
import { CreateAddressUseCase } from '../../../../../Domain/useCases/address/CreateAddress';
import { UserContext } from '../../../../context/UserContext';

const ClientAddressCreateViewModel = () => {

    const [values, setValues] = useState({
        address: '',
        neighborhood: '',
        refPoint: '',
        lat: 0.0,
        lng: 0.0,
        id_user: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, saveUserSession, getUserSession } = useContext(UserContext);

    useEffect(() => {
        if (user.id != '') {
            onChange('id_user', user.id);
        }
    }, [user])
    

    const onChange = (property: string, value: any) => {
        setValues({ ...values, [property]: value });
    }
    
    const onChangeRefPoint = (refPoint: string, lat: number, lng:number) => {
        setValues({ ...values, refPoint: refPoint, lat: lat, lng: lng });
    }

    const createAddress = async () => {
        console.log('FORMULARIO: ' + JSON.stringify(values));
        
        setLoading(true);
        const response = await CreateAddressUseCase(values);
        setLoading(false);
        setResponseMessage(response.message);
        if (response.success) {
            resetForm();
            user.address = values;
            user.address.id = response.data
            await saveUserSession(user);
            getUserSession();
        }
    }

    const resetForm = async () => {
        setValues({
            address: '',
            neighborhood: '',
            refPoint: '',
            lat: 0.0,
            lng: 0.0,
            id_user: user.id!,
        })
    }

    return {
        ...values,
        onChange,
        createAddress,
        onChangeRefPoint,
        loading,
        responseMessage
    }
}

export default ClientAddressCreateViewModel;