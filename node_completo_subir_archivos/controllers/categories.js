

const { response, request } =  require('express');

const Categoria  = require('../models/categoria')

//Obtener categorias - paginado - total - pupulate

const obtenerCategorias = async( req = request, res = response ) => {

    const { desde = 0, hasta = 100 } = req.query;

    const [ totalCategorias, categorias ] = await Promise.all([
        Categoria.countDocuments({ state : true }),

        Categoria.find({ state : true })
            .populate( 'user', 'name' )
            .skip( Number(desde) )
            .limit( Number(hasta) )
    ]);


    res.status(200).json({
        totalCategorias,
        categorias
    });


};


//Obtener categoria - total - populate {} va a obtener el objeto de la categoria
const obtenerCategoria = async( req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id )
        .populate( 'user', 'name' )

    if( !categoria.state ){
        return res.status(400).json({
            msg: `La categoria ${ categoria.name } no está disponible` 
        });
    }

    res.status(200).json({
        categoria,
    });
};

//Crea la categoria
const crearCategoria = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({ name });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ name } ya existe`,
        }); 
    };


    // Generar la data a guardar 
    const data = {
        name,
        user: req.user._id
    };


    const categoria = await new Categoria( data );
    await categoria.save();

    res.status(201).json({
        msg: 'Categoria creada',
    });

};


//Actualizar categoria - se recibe el nombre y no debe existir, se actualiza el mismo
const actualizarCategoria = async( req = request, res = response ) => {

    const { id } = req.params;

    const { _id, user, state, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;
    
    await Categoria.findByIdAndUpdate( id, data );

    res.status(200).json({
        msg: `Categoria con el ID: ${id} actualizada correctamente`,
    });


};

//Borrar categoria - se manda el id, se verifica 
const borrarCategoria = async( req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { state : false } );

    res.status(200).json({
        msg: `Catgoria: ${ categoria.name } eliminada`,
    });

};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria,
};