import mongoose from 'mongoose'

const dbConnection = async()=>{
    try {
       await mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
       })  //si esto falla es atrapado por el catch
       
        console.log("Base de datos conectada!")

    } catch (error) {
        console.log(error)
        throw new Error("Error en la conexión con la DB")
    }
}

export default dbConnection