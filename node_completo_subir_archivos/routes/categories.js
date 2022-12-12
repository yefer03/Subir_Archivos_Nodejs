
const { Router } =  require('express');
const { check } = require('express-validator'); 

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        borrarCategoria, 
        actualizarCategoria } = require('../controllers/categories');

const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');


const validarCampos = require('../middlewares/validar-campos');
const { categoriaActiva } = require('../middlewares/validar-estado-categoria');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Obtener todas las categorias - publico - get
router.get('/', obtenerCategorias);


// Obtener una categoria - publico - get con id
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);


// Crear una categoria - privado - cualquier persona con un token valido - post
router.post('/', [ 
    validarJWT,
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);


// Actualizar un registro por id - privado - put con id, cualquiera con un token valido
router.put('/:id',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);


// Borrar una categoria - solo un admin con token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    categoriaActiva,
    validarCampos
], borrarCategoria);


module.exports = router; 