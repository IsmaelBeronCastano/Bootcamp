import {Router} from 'express'
import proyectoController from '../controllers/proyecto.controller.js'
import checkAuth from '../middlewares/checkAuth.middleware.js'
import {comprobarIdMongo} from '../middlewares/comprobarIdMongo.middleware.js'

const router = Router()


router.get('/', checkAuth, proyectoController.obtenerProyectos)
router.get('/:id', checkAuth, comprobarIdMongo, proyectoController.obtenerProyecto)
router.post('/', checkAuth, proyectoController.crearProyecto)
router.put('/:id', checkAuth, comprobarIdMongo, proyectoController.editarProyecto)
router.delete('/:id', checkAuth, comprobarIdMongo, proyectoController.eliminarProyecto)
router.post('/agregar-colaborador/:id', checkAuth, proyectoController.agregarColaborador)
router.post('/eliminar-colaborador/:id', checkAuth, proyectoController.eliminarColaborador)

export default router

