
const validarJWT              = require('../middlewares/validar-jwt');
const validaRoles             = require('../middlewares/validar-roles');
const validarArchivo = require('./validar-archivo');

module.exports = {
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo,
};