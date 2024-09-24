import { IUser } from "@users/interfaces/user.interface";
import { model, Schema, Model } from "mongoose";


const userSchema: Schema= new Schema({

    name: {type: String, required: true, unique: true, indexedDB: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
},{
    timestamps: true
})

const UserModel: Model<IUser>= model<IUser>(`User`, userSchema, 'User')

export {UserModel}