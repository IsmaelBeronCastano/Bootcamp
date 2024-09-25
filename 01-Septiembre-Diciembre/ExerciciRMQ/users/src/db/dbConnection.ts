import { config } from '../config'
import mongoose from 'mongoose'


export async function dbConnection(): Promise<void>{

    try {
        await mongoose.connect(`${config.DATABASE_URL}` )
        console.log("Database connected!")
    } catch (error) {
        console.log("Database not connected!", error)
    }

}