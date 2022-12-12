
const { response, request } =  require('express');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) =>{

    //Los headers se leen conm req.header('nombre del header')
    const { token } = req.query;

    if ( !token ) {
        console.log(token);
        return res.status(401).json({   
            msg: 'There is no token in the petition'
        });
    };



    try {

        //Verifica el token
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido -Usuario no existe en DB' ,   
            });
        };

        //Verificar si el uid está activo o no

        if ( !usuario.state ) {
            return res.status(401).json({
                msg: 'Token no valido -Usuario inactivo' 
            });
        };

        req.user = usuario;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token',
        });
    };

};



module.exports = {
    validarJWT
};