import mongoose from 'mongoose'


const proyectoSchema = mongoose.Schema({

    nombre:{
        type: String,
        trime: true,
        required: true
    },
    descripcion: {
        type: String,
        trime: true,
        required: true
    },
    fechaEntrega:{
        type: Date,
        default: Date.now()
    },
    cliente:{
        type: String,
        trime: true,
        required: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    colaboradores:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
},{
    timestamps: true
})

const Proyecto = mongoose.model("Proyecto", proyectoSchema)

export default Proyecto
