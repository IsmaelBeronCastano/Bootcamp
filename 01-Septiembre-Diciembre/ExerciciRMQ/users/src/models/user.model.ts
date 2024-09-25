import { IUser } from "@users/interfaces/IUser";
import { model, Model, Schema } from "mongoose";


const userSchema: Schema = new Schema({
    username: {type: String, required: true, indexedDB: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
    
})

const User: Model<IUser>=model<IUser>('User', userSchema, 'User')

export {User}