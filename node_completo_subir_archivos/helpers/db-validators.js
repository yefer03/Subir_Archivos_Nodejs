
//Se importa el modelo para poder validar contra la base de datos
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


const esRoleValido = async( role = '' ) =>{

    const existeRole = await Role.findOne({ role }); 
    if( !existeRole ){
        throw new Error( `The role ${role} is not registered in the database` );
    };

};


const emailExiste = async( email = '' ) =>{

    const existeEmail = await Usuario.findOne({ email });
    if( existeEmail ){
        throw new Error( `El email: ${email}, ya está registrado` );
    };

};


const existeUsuarioPorId = async( id = '' ) =>{

    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error( `El ID: ${email}, no existe` );
    };

};


const existeCategoriaPorId = async( id ) =>{

    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ){
        throw new Error( `El ID:  ${ id }, no existe en ninguna categoria` );
    };

};


const existeProductoPorId = async( id ) =>{

    const existeProducto = await Producto.findById( id );

    if( !existeProducto ){
        throw new Error( `El ID:  ${ id }, no existe en ningun producto` );
    };

};


const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) =>{

    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error( `La colección: ${ coleccion } no es permitida -- ${ colecciones }` );
    };

    return true;

};



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
};