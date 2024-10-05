import mongoose from "mongoose"

interface Options{
    mongoUrl: string
    dbName: string
}

export class MongoConnection{


    static async connection(options: Options){
        const {mongoUrl, dbName} = options
        try {
            await mongoose.connect(mongoUrl,{
                dbName
            })
            console.log('mongo is connected!')
            return true
        } catch (error) {
            console.log("database not connected!")
            throw error
        }
    }

}