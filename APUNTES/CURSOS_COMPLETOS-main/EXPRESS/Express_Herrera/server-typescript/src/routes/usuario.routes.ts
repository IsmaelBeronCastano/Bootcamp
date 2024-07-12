import {Router} from 'express'
import { createUsuario, deleteUsuario, getUsuario, getUsuarios, updateUsuario } from '../controllers/usuario.controller'

const usuarioRouter = Router()

usuarioRouter.get('/', getUsuarios)
usuarioRouter.get('/:id', getUsuario)
usuarioRouter.post('/', createUsuario)
usuarioRouter.put('/:id', updateUsuario)
usuarioRouter.delete('/:id', deleteUsuario)

export default usuarioRouter