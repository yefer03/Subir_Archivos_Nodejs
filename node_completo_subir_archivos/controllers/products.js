


const { response, request } =  require('express');

const Producto = require('../models/producto');


//Obtener categorias - paginado - total - pupulate
const obtenerProductos = async( req = request, res = response ) => {

    const { desde = 0, hasta = 100 } = req.query;

    const [ totalProductos, productos ] = await Promise.all([
        Producto.countDocuments({ state : true }),

        Producto.find({ state : true })
            .populate( 'user', 'name' )
            .skip( Number(desde) )
            .limit( Number(hasta) )
    ]);


    res.status(200).json({
        totalProductos,
        productos
    });

};


//Obtener categoria - total - populate {} va a obtener el objeto de la categoria
const obtenerProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
        .populate( 'user', 'name' )


    if ( !producto ) {
        return res.status(400).json({
            msg: `El producto con el ID: ${ id }, no existe`,
        });
    };

    res.status(200).json({
        producto,
    });

};


//Crea la categoria
const crearProducto = async( req = request, res = response ) => {

    const { _id, state, user, ...body } = req.body ;
    const name = body.name;
    const productoDB = await Producto.findOne({ name });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto: ${ name } ya existe`,
        }); 
    };

    // Generar la data a guardar 
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    };

    const producto = await new Producto( data );
    await producto.save();

    res.status(201).json({
        msg: 'Producto creado',
        producto
    });
    
};


//Actualizar categoria - se recibe el nombre y no debe existir, se actualiza el mismo
const actualizarProducto = async( req = request, res = response ) => {  
    
    const { id } = req.params;

    const { _id, user, state, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;
    
    await Producto.findByIdAndUpdate( id, data );

    res.status(200).json({
        msg: `Producto con el ID: ${id} actualizada correctamente`,
    });

};


//Borrar categoria - se manda el id, se verifica 
const borrarProducto = async( req = request, res = response ) => {


    const { id } = req.params;
    
    await Producto.findByIdAndUpdate( id, { state : false } );

    res.status(200).json({
        msg: `El producto con el ID: ${id} fue borrado`,
    });

};


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
};


