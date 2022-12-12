
//Importaciones de las instalaciones
const { Router } =  require('express');
const { check } = require('express-validator'); 

//Importaciones de codigo
const validarCampos = require('../middlewares/validar-campos');


const { validarJWT,
        esAdminRole,
        tieneRole } = require('../middlewares')

const { esRoleValido, 
        emailExiste, 
        existeUsuarioPorId } = require('../helpers/db-validators');


const { usersGet, 
        usersPut, 
        usersPost,
        usersDelete, 
        usersPatch } = require('../controllers/users');
        

//Hace la instancia del router para manejar las rutas
const router = Router();


//Se definen las rutas con cada peticion  usando el router
//El usersGet es el controlador de esta ruta que viene de la carpeta controllers
router.get('/', usersGet );


//Para capturar info que viene en la ruta, se coloca dos puntos y el nombre de la variable en 
//la que va a ser capturada, luego va a la req y llega en los params
router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCampos,
], usersPut );


//La primera validacion son los middlewares y se mandan
//Como un arreglo si son mas de 1 
router.post('/', [
    //Primero se coloca el campo que voy a valodar
    //Segundo isEmail para que sepa lo que tiene que ser
    //check('role', `No es un rol permitido`).isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe tener 6 letras o mas').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( emailExiste ),
    check('role').custom( esRoleValido ),
    validarCampos,
],usersPost); 


router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole( 'ADMIN_ROLE' ), //Esta funcion debe retornar otra
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos,
], usersDelete );


router.patch('/', usersPatch );


module.exports = router;