 
const { validationResult } = require('express-validator');
 

const validarCampos = ( req = request, res = response, next ) =>{

    //Estos son los errores recolectados en los checks de las rutas
    const errors = validationResult(req)

    //Valida si hay errores
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    };

    next();
};


module.exports = validarCampos;