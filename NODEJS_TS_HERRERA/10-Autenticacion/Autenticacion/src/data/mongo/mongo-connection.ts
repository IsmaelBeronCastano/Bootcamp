import mongoose from "mongoose"

interface connectionOptions{
    mongoUrl: string
    dbName: string
}

export class MongoDBConnection{
    
    static async connect(options: connectionOptions){
        const {mongoUrl, dbName} = options

        try {
            await mongoose.connect(mongoUrl, {
                dbName
            
            })
            console.log('Mongo connected')
            return true
        
        } catch (error) {
            console.log('Mongo connection error')
            throw error
        }

    }
}