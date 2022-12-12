//Importaciones de express
const { response, request } =  require('express');

//Importamos para la encriptacion de contraseñas
const bcryptjs = require('bcryptjs');  


//Se importa el modelo del usuario
const Usuario = require('../models/usuario');


const usersGet = async( req = request, res = response )=> {

    //Para obtener los querys se cogen del req.query
    const { desde = 0, limite = 100 } = req.query;

    // const conteo = await Usuario.countDocuments({ state : true });

    // const usuarios = await Usuario.find({ state : true }) //Filtro para obtener solo los activos
    //     .skip( Number(desde) )  //Para especificar desde que registro se va a paginar
    //     .limit( Number(limite) ); //Para limitar cuantos registros se quieren obtener


    //Para simplificar los 2 promesas anteriores se colocan las 2 en una sola
    //Así se obtienen los resultados de las 2 al mismo tiempo y se optimiza
    const [ totalUsuarios, usuarios ] = await Promise.all([
        Usuario.countDocuments({ state : true }),

        Usuario.find({ state : true })
            .skip( Number(desde) )
            .limit( Number(limite) ),

    ]);

    res.status(200).json({
        total: `En la base de datos hay ${ totalUsuarios } registros`,
        usuarios,
    });
}


const usersPut = async( req = request, res = response )=> {
    
    //Los params son las variables que se capturan en las rutas y luego llegan en la req
    //const { id } = req.params; se pueden desestructurar directamente

    const id = req.params.id;

    const { _id, password, google, email, ...resto } = req.body;
    //Validar contra la base de datos

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt ); 
    }

    //Busca por el id y actualiza, se le pasa el id y como segundo parametro las propiedades que se van a actualizar 
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.status(200).json({
        usuario,
        msg: `put API from the controller, ID send: ${id}`,
        
    });
}


const usersPost = async( req = request, res = response )=> {

    const { name, email, password, role } = req.body;

    //Estancia del modelo y se manda un objeto con los campos obligatorios en el esquema
    const usuario = new Usuario({ name, email, password, role });

    //2- Hacer la encriptacipn de la password

    //Crea el numero de saltos que le va a hacer a la encriptación
    const salt = bcryptjs.genSaltSync();

    //Se hace el proceso de encriptacion de la password
    //primero pide lo que se va a encriptar y segundo la constante de los saltos 
    usuario.password = bcryptjs.hashSync( password, salt ); 

    //3- Guardar el registro en la BD


    await usuario.save();

    res.status(200).json({
        msg: 'User created successfully',
        usuario,
    });
}


const usersDelete = async( req = request, res = response )=> {

    const id = req.params.id;
    
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false} );

    res.status(200).json({
        msg: 'Usuario inactivo',
        usuario,
    });
}


const usersPatch = ( req = request, res = response )=> {
    res.status(200).json({
        msg: 'patch API from the controller',
    });
}


module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
};