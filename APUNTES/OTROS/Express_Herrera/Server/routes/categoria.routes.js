import {Router} from 'express'
import categoria from '../controllers/categoria.controller.js'
import {check} from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import validarJWT from '../middlewares/validar-jwt.js'
import { esRolValido, existeCategoria } from '../helpers/db-validators.js'
import { esAdminRole } from '../middlewares/validar-roles.js'


const router = Router()

router.get('/', categoria.getCategorias)

router.get('/:id',[
    check('id', 'No es un id de mongo válido').isMongoId().bail().custom(existeCategoria), validarCampos
],categoria.getCategoria)

router.post('/',[validarJWT,
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    validarCampos], categoria.addCategoria)

router.put('/:id',[ validarJWT, 
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    check('id', 'No es un id de mongo válido').isMongoId().bail().custom(existeCategoria), validarCampos
], categoria.updateCategoria)

router.delete('/:id',[ validarJWT, esAdminRole,
    check('id', 'No es un id de mongo válido').isMongoId().bail().custom(existeCategoria), validarCampos
], categoria.deleteCategoria)


export default router