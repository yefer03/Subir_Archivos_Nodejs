
const { response, request, json } =  require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login  = async( req = request, res = response ) =>{

    const { email, password } = req.body;

    try {
        
        //Verificar si el usuario exite

        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                msg: 'The user or password is not correct',
            });
        };

        //Verificar si el usuario está activo

        if ( !usuario.state ) {
            return res.status(400).json({
                msg: 'The user is inactive',
            });
        };

        //Verificar la contraseña
        
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Error in the login, try again',
            }); 
        };

        //Generar el JWT

        const token = await generarJWT( usuario.id )


        res.status(200).json({
            usuario,
            token
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong, talk with the administrator',
        });

    };

};



const googleSignIn  = async( req = request, res = response ) =>{

    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify( id_token );


        let usuario = await Usuario.findOne({ email });

        if ( !usuario ) {

            const data = {
                name,
                email,
                password: ':3',
                img,
                google: true,
            };

            usuario = new Usuario( data );
            usuario.save();
        };


        //Verificar el estado del usuario
        if ( !usuario.state ) {

            return res.status(401).json({
                msg: 'Talk with the administrator because this user is inactive'
            });  

        };

        //Generar el jwt para el usuario
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,  
            token,
        });
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: `The token could not be verified   `
        });
    }
    


}




module.exports = {
    login,
    googleSignIn,
};