import Categoria from '../models/categoria.js'

const getCategorias = async (req,res)=>{
    const {desde= 0, limite=5} = req.query
    const query = { estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(+limite)
    ])
                              
    
    res.json({
        total,
        categorias
    })
}

const getCategoria = async (req,res)=>{
    const {id} = req.params

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json({
        categoria
    })
}

const addCategoria = async (req,res)=>{
    const nombre = req.body.nombre.toUpperCase() //quiero almacenar las categorías en mayúsculas
    //debo comprobar si existe la categoria
    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({msg: "La categoría ya existe"})
    }

    const data = {
        nombre,
        usuario : req.usuario._id  //_id porque así es como Mongo lo está grabando ( aunque para mostrarlo use id por la modificación que hice)
    }

    const categoria = new Categoria(data)
    await categoria.save()

    res.status(201).json({
        categoria
    })
}

const updateCategoria = async (req,res)=>{
    const {id} = req.params

    const {estado, usuario, ...data}= req.body 

    data.nombre = data.nombre.toUpperCase() //me aseguro de guardar el nombre en mayúsculas

    data.usuario = req.usuario._id //me aseguro de que el usuario sea el que viene en req.usuario, el dueño del token

    const categoria= await Categoria.findByIdAndUpdate(id, data, {new: true})

    res.json({
        categoria
    })
}

const deleteCategoria = async (req,res)=>{

    const {id} = req.params

    await Categoria.findByIdAndUpdate(id, {estado: false})

    res.json({
        msg: "categoría borrada!"
    })
}

export default{
    getCategorias,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoria

}