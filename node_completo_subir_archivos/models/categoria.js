
const { Schema, model } = require('mongoose');


const categoriaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
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
});


categoriaSchema.methods.toJSON = function(){
    //Esto crea una instancia con los valores respectivos del esquema pero como si fuera un objeto literal
    const { __v, state, ...categoria } = this.toObject();
    return categoria;
};  



module.exports = model( 'Categoria', categoriaSchema );