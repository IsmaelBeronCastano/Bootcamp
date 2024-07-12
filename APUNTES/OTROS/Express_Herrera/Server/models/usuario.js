import mongoose from 'mongoose'

const usuarioSchema = mongoose.Schema({
    
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password:{
        type: String,
        required: [true, 'El password es obligatorio']
    },

    img:{
        type: String,
    },

    rol:{
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
        default: 'USER_ROLE' 
    },

    estado:{
        type: Boolean,
        default: true
    },

    googgle:{ //si el usuario ha sido creado por google
        type: Boolean,
        default: false
    }

})

usuarioSchema.methods.toJSON = function(){
    const {__v, password, ...usuario} = this.toObject() //esto me va a generar mi instancia pero con sus valores respectivos, uso la desestructuración
    return usuario
}

usuarioSchema.methods.toJSON = function(){
    const {_id,...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

const Usuario= mongoose.model('Usuario', usuarioSchema)

export default Usuario