import express from 'express'
import userController from '../controllers/user.controller.js'
import {check} from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import { esRolValido, existeMail, userExistsById } from '../helpers/db-validators.js'
import validarJWT from '../middlewares/validar-jwt.js'
import tieneRole from '../middlewares/validar-roles.js'
//import esAdminRole from '../middlewares/validar-roles.js'


const router = express.Router()

router.get('/', userController.usuariosGet)

router.post('/', 
[check('correo', 'El correo no es válido').isEmail(),
 check('nombre', 'El nombre es obligatorio').not().isEmpty(),
 check('password', 'El password es obligatorio y debe de ser de más de 6 letras').isLength({min: 6}),
 check('rol').custom(esRolValido), 
 check('correo').custom(existeMail),
    validarCampos //lo coloco el último porque una vez hechas las validaciones ejecuto la que va a revisar los errores
], userController.usuariosPost)

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById), check('rol').custom(esRolValido), validarCampos
], userController.usuariosPut)

router.patch('/:id', userController.usuariosPatch)

router.delete('/:id', [
    validarJWT,
   // esAdminRole,
   tieneRole('ADMIN_ROLE','VENTAS_ROLE','USER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById), 
    validarCampos
],
userController.usuariosDelete)


export default router