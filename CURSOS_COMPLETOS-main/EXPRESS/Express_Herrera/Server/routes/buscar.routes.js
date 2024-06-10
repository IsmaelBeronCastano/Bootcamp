import {Router} from 'express'
import buscarController from '../controllers/buscar.controller.js'

 const router = Router()

 router.get('/:coleccion/:termino', buscarController.buscar)

 export default router

