
const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    state: {
        type: Boolean,
        default: true,
        require: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        require: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'categoria',
        require: true,
    },
    description: {
        type: String,
        default: 'Producto sin descripcion',
    },
    available: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
});


ProductoSchema.methods.toJSON = function(){
    //Esto crea una instancia con los valores respectivos del esquema pero como si fuera un objeto literal
    const { __v, state, ...producto } = this.toObject();
    return producto;
};  



module.exports = model( 'Producto', ProductoSchema );