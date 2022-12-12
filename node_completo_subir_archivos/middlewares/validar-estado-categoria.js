


const { response, request } = require('express')

const Categoria = require('../models/categoria')


const categoriaActiva = async( req = request, res = response, next ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id )

    if ( !categoria.state ) {
        return res.status(400).json({
            msg: `La categoria: ${ categoria.name } ya fue eliminada anteriormente `,
        });
    };

    next();

};


module.exports = {
    categoriaActiva,
}
