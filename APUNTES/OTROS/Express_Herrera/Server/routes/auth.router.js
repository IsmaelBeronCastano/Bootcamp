import {Router} from 'express'
import auth from '../controllers/auth.controller.js'
import { check } from 'express-validator' 
import { validarCampos } from '../middlewares/validar-campos.js'


const router = Router()

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], auth.LoginController)

router.post('/google', [
    check('googleToken', 'el token de Google es necesario').not().isEmpty(),
    validarCampos
], auth.loginGoogle)

export default router