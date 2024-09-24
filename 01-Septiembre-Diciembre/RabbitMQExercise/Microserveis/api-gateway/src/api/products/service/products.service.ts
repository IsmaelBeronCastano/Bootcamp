import { AxiosService } from "../../../axios";
import {config} from '../../../config'
import axios, { AxiosResponse } from "axios";
import { IProduct } from "../interfaces/IProduct.interface";



export let axiosProductsInstance: ReturnType<typeof axios.create>

class ProductsService{
axiosService : AxiosService

    constructor(){
        this.axiosService = new AxiosService(`${config.PRODUCTS_BASE_URL}/api/v1/products`, 'products')
        axiosProductsInstance = this.axiosService.axios

    }

    async getProducts(): Promise<AxiosResponse>{
        const response: AxiosResponse = await axiosProductsInstance.get('/get-products')
        return response
    }

    async getProduct(id: string): Promise<AxiosResponse>{
        const response: AxiosResponse = await axiosProductsInstance.get(`get-product/${id}`)
        return response 
    }

    async createProduct(body: IProduct): Promise<AxiosResponse>{
        const response: AxiosResponse = await axiosProductsInstance.post('create-product', body)
        return response
    }

    async updateProduct(id: string, body:IProduct):Promise<AxiosResponse>{
        const response = await axiosProductsInstance.put(`update-product/${id}`, body)
        return response
    } 

    async deleteProduct(id: string): Promise<AxiosResponse>{
        const response = await axiosProductsInstance.delete(`delete-product/${id}`)
        return response
    }


}

export let productsService = new ProductsService()