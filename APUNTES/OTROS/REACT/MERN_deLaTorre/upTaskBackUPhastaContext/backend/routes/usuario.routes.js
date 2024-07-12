import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import  checkAuth from "../middlewares/checkAuth.middleware.js";
import { comprobarIdMongo } from "../middlewares/comprobarIdMongo.middleware.js";

const router = Router()

router.put('/:id', comprobarIdMongo, usuarioController.putUsuario)
router.delete('/:id', comprobarIdMongo, usuarioController.deleteUsuario)


router.get('/confirmar/:token', usuarioController.confirmarCuenta)
router.get('/olvide-password/:token', usuarioController.comprobarToken)
router.get('/perfil', checkAuth, usuarioController.obtenerPerfil)

router.post('/', usuarioController.postUsuario)
router.post('/login', usuarioController.login)
router.post('/olvide-password', usuarioController.olvidePassword)
router.post('/nuevo-password/:token', usuarioController.nuevoPassword)


export default router