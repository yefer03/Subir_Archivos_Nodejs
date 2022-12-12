
const { Router } =  require('express');
const { check } = require('express-validator'); 


const validarCampos = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');



const router = Router();


router.post('/login', [
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validarCampos,
], login );


router.post('/google', [
    check('id_token', 'The google token is required').not().isEmpty(),
    validarCampos,
], googleSignIn );



module.exports = router;