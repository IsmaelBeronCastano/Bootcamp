import { AxiosError } from 'axios';
import { ImageInfo } from 'expo-image-picker';
import { Product } from '../../Domain/entities/Product';
import { ProductRepository } from '../../Domain/repositories/ProductRepository';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';
import mime from 'mime';
import { ApiDeliveryForImage, ApiDelivery } from '../sources/remote/api/ApiDelivery';

export class ProductRepositoryImpl implements ProductRepository {

    async getProductsByCategory(idCategory: string): Promise<Product[]> {
        try {
            const response = await ApiDelivery.get<Product[]>(`/products/findByCategory/${idCategory}`);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            return Promise.resolve([]);
        }
    }

    async create(product: Product, files: ImageInfo[]): Promise<ResponseApiDelivery> {
        try {
            let data = new FormData();

            files.forEach(file => {
                data.append('image', {
                    // @ts-ignore
                    uri: file.uri,
                    name: file.uri.split('/').pop(),
                    type: mime.getType(file.uri)!
                });
            });
            
            data.append('product', JSON.stringify(product));
            const response = await ApiDeliveryForImage.post<ResponseApiDelivery>('/products/create', data);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

    async update(product: Product): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.put<ResponseApiDelivery>('/products/update', product);
            return Promise.resolve(response.data);    
        } 
        catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

    async updateWithImage(product: Product, files: ImageInfo[]): Promise<ResponseApiDelivery> {
        try {
            let data = new FormData();

            files.forEach(file => {
                data.append('image', {
                    // @ts-ignore
                    uri: file.uri,
                    name: file.uri.split('/').pop(),
                    type: mime.getType(file.uri)!
                });
            });
            
            data.append('product', JSON.stringify(product));
            const response = await ApiDeliveryForImage.put<ResponseApiDelivery>('/products/updateWithImage', data);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

    async remove(product: Product): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.delete<ResponseApiDelivery>(`/products/delete/${product.id}`);
            return Promise.resolve(response.data)

        } catch (error) {
            let e = (error as AxiosError);
            console.log('ERROR: ' + JSON.stringify(e.response?.data));
            const apiError:ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data)); 
            return Promise.resolve(apiError)
        }
    }

}