import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    available:{
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    description:{
        type: String

    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }

})


export const ProductModel = mongoose.model('Product', productSchema)