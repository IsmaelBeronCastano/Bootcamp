import {Router} from 'express'
import tareaController from '../controllers/tarea.controller.js'
import checkAuth from '../middlewares/checkAuth.middleware.js'
import { comprobarIdMongo } from '../middlewares/comprobarIdMongo.middleware.js'

const router = Router()

router.route("/:id")
        .get(checkAuth, comprobarIdMongo, tareaController.getTarea)
        .put(checkAuth, comprobarIdMongo, tareaController.editarTarea)
        .delete(checkAuth, comprobarIdMongo, tareaController.editarTarea)
        
router.post("/", checkAuth, tareaController.crearTarea)
router.post("/estado/:id", checkAuth, comprobarIdMongo, tareaController.cambiarEstado)

export default router