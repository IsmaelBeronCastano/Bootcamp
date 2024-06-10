import {Router} from 'express'
import productoController from '../controllers/producto.controller.js'
import {validarCampos} from '../middlewares/validar-campos.js'
import validarJWT from '../middlewares/validar-jwt.js'
import { check } from 'express-validator'
import { existeCategoria, existeProducto, userExistsById } from '../helpers/db-validators.js'
import { esAdminRole } from '../middlewares/validar-roles.js'

const app = Router()

app.get('/', productoController.getProductos)
app.get('/:id',[
    check('id', 'No es un id válido').isMongoId().bail().custom(existeProducto),    
    validarCampos
], productoController.getProducto)

app.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', "No existe la categoría").isMongoId().bail().custom(existeCategoria),
    validarCampos
] ,productoController.addProducto)

app.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId().bail().custom(existeProducto),    
    validarCampos
], productoController.updateProducto)

app.delete('/:id',[
    validarJWT, esAdminRole,
    check('id', 'No es un id válido').isMongoId().bail().custom(existeProducto),   
    validarCampos
],
 productoController.deleteProducto)

export default app