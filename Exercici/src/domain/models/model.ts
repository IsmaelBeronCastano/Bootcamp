import mongoose from "mongoose";
import Mail from "nodemailer/lib/mailer";

export interface Address{
    street: string,
    city: string,
    state: string,
}


const emailSchema = new mongoose.Schema({    

    title:{
        type: String,
        required: true
    },
    
    body: {
        type: String,
        required: true
    },

    address:{
        type: {street: String, city: String, state: String},
        required: true
    },

    createdAt: {
        type: Date,
        default: new Date()
    },

    pictures:{
        type: [{filename: String}]
    }
})


export const EmailModel = mongoose.model('Email', emailSchema)