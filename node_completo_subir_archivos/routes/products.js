

const { Router } =  require('express');
const { check } = require('express-validator'); 

const { obtenerProductos, 
        obtenerProducto, 
        crearProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/products');
        
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const validarCampos = require('../middlewares/validar-campos');

const { esAdminRole, validarJWT } = require('../middlewares');


const router = Router();


// Obtener todos los productos - publico - get   
router.get('/', obtenerProductos);               

// Obtener un producto - publico - get con id
router.get('/:id', [
    check('id', 'No es un ID valido').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);


// Crear un producto - privado - cualquier persona con un token valido - post   
router.post('/', [
    validarJWT,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categorie', 'La categoria es obligatoria').not().isEmpty(),
    check('categorie').custom( existeCategoriaPorId ),
    validarCampos,
], crearProducto);


// Actualizar un registro por id - privado - put con id, cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);


// Borrar un producto - solo un admin con token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);


module.exports = router; 