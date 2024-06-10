import {Schema, model} from 'mongoose'

const productoSchema = Schema({

    nombre: {
        type: String,
        required: true,
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio:{
        type: Number,
        default: 0,
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {type:String},
    disponible: {type: Boolean, default: true}
})

productoSchema.methods.toJSON = function(){
    const {__v, estado, ...producto} = this.toObject()
    return producto
}

const Producto = model('Producto', productoSchema)

export default Producto


