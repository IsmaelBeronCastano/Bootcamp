import { IProduct } from '@users/interfaces/IProduct.interface'
import { model, Model, Schema } from 'mongoose'

export const ProductSchema: Schema =  new Schema({
    name: {type: String, required: true},
    price:{type: Number, required: true, },
    quantity:{type: Number, required: true},
    avaliable:{type: Boolean, default: true}
},{
    timestamps: true
})  

const productModel: Model<IProduct>= model<IProduct>('Product', ProductSchema, 'Product')

export {productModel}