import Producto from '../models/producto.js'

const getProductos = async (req,res)=>{

    const {desde=0, limite=5} = req.query

    const [total, productos] = await Promise.all([
        await Producto.countDocuments({estado: true}),
        await Producto.find({estado: true})
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
    ])

    res.json({
        total,
        productos
    })
}

const getProducto = async (req,res)=>{

    const {id} = req.params

    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre')

    if(!producto) throw new Error(`El producto con id ${id} no existe`)


    res.json({
        producto
    })
}

const addProducto =async (req,res)=>{

    const {estado, usuario, ...body} = req.body
    const nombre = body.nombre.toUpperCase()
    const productoDB = await Producto.findOne({nombre})

    if(productoDB){
        throw new Error(`El producto con nombre ${productoDB.nombre} ya existe`)
    } 
        


    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id
    }

    const producto = new Producto(data)
    await producto.save()

    return res.status(200).json({
        producto
    })
}

const updateProducto =  async (req,res)=>{
    const {id} = req.params

    const {estado, usuario, ...data} = req.body

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase()

    }

    data.usuario = req.usuario._id


    const producto = await Producto.findByIdAndUpdate(id, data, {new: true} )
    
    res.json({
        producto
    })
}

const deleteProducto = async (req,res)=>{
    const id = req.params.id

    

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true} )
    
    res.json({
        productoBorrado
    })

}

export default{
    getProductos,
    getProducto,
    addProducto,
    updateProducto,
    deleteProducto
}