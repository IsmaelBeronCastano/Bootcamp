import React, { useState, useContext } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { UpdateCategoryUseCase } from '../../../../../Domain/useCases/category/UpdateCategory';
import { UpdateWithImageCategoryUseCase } from '../../../../../Domain/useCases/category/UpdateWithImageCategory';
import { Category } from '../../../../../Domain/entities/Category';
import { ResponseApiDelivery } from '../../../../../Data/sources/remote/models/ResponseApiDelivery';
import { CategoryContext } from '../../../../context/CategoryContext';

const AdminCategoryUpdateViewModel = (category: Category) => {

    const [values, setValues] = useState(category);
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<ImagePicker.ImageInfo>()
    const { update, updateWithImage } = useContext(CategoryContext);

    const onChange = (property: string, value: any) => {
        setValues({ ...values, [property]: value });
    }

    const updateCategory = async () => {
        setLoading(true);
        let response = {} as ResponseApiDelivery;
        if (values.image?.includes('https://')) { // ACTUALIZAR SIN IMAGEN
            response = await update(values);
        }
        else { // ACTUALIZAR CON IMAGEN
            response = await updateWithImage(values, file!);
        }
        setLoading(false);
        setResponseMessage(response.message);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            onChange('image', result.assets[0].uri); // file://ksdajkaskj.png
            setFile(result.assets[0]);
        }
    }
    
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            onChange('image', result.assets[0].uri); // file://ksdajkaskj.png
            setFile(result.assets[0]);
        }
    }

    
    return {
        ...values,
        onChange,
        takePhoto,
        pickImage,
        updateCategory,
        loading,
        responseMessage
    }
}

export default AdminCategoryUpdateViewModel;