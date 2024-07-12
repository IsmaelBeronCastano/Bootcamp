import mongoose from 'mongoose'

const roleSchema = mongoose.Schema({
    rol:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
    
})

const Role = mongoose.model('Role', roleSchema)

export default Role