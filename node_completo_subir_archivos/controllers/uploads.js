
const path = require('path');
const fs = require('fs');

const { request, response } = require('express');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo } = require('../helpers');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const cargarArchivo = async( req = request, res = response ) => {

    try {
        //const nombre = await subirArchivo( req.files, [ 'txt', 'md' ], 'textos  ' );
        const nombre = await subirArchivo( req.files, undefined, 'images' );
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    };

};


const actualizarImagen = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo ;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el ID: ${ id }` })
            };
        break;
    

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el ID: ${ id }` })
            };
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });

    };



    //Limpiar imagenes previas

    if ( modelo.image ) {
        //Borrar la imagen el servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.image )

        //Hace la comprobacion si existe el file en la ruta que se creó anterioremente
        if ( fs.existsSync( pathImagen ) ) {
            //Si existe el archivo en el modelo entonces se ejecuta el codigo y lo elimina
            fs.unlinkSync( pathImagen );
        };
    };


    //Crea el nombre de la ruta donde se va a guardar la imagen que se le asignara
    const nombre = await subirArchivo( req.files, undefined, coleccion );

    modelo.image = nombre;

    await modelo.save();

    res.json({ modelo })
};


const actualizarImagenCloudinary = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo ;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el ID: ${ id }` })
            };
        break;
    

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el ID: ${ id }` })
            };
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });

    };


    //Comprueba si el modelo ya tiene una imagen subirda y si es así hace la eliminacion de
    //esta en cloudinary cogiendo el id de la imagen y enviandola como argumento en el destroy
    if ( modelo.image ) {
        const nombreArr     = modelo.image.split('/');
        const nombre        = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    };



    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.image = secure_url;
    await modelo.save();

    res.json({ modelo });
};


const mostrarImagen = async ( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo ;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un usuario con el ID: ${ id }` })
            };
        break;
    

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({ msg: `No existe un producto con el ID: ${ id }` })
            };
        break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });

    };

    //Limpiar imagenes previas
    if ( modelo.image ) {
        //Borrar la imagen el servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.image )

        //Hace la comprobacion si existe el file en la ruta que se creó anterioremente
        if ( fs.existsSync( pathImagen ) ) {
            //Si existe el archivo en el modelo entonces lo envia como respuesta
            return res.sendFile( pathImagen );
        };  
    };


    const pathImagenError = path.join( __dirname, '../assets/no-image.jpg',);
    res.sendFile( pathImagenError );

};


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
};

