import mongoose from "mongoose";

export const conectarDB = async ()=>{
    try {
        
        const connection = await mongoose.connect(process.env.STRING_CONNECTION,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Conexión realizada!")
        
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}