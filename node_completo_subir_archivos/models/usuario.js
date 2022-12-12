
//Se tienen que extraer
const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'The password  is required'],
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE',
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {        
        type: Boolean,
        default: true,
    },

});

//Funcion para quitar propiedades en las respuestas
UsuarioSchema.methods.toJSON = function(){
    //Esto crea una instancia con los valores respectivos del esquema pero como si fuera un objeto literal
    const { __v, _id, password, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario ;
};  


//Para exportar un model se coloca siempre en singular porque
//mongoose le agrega la S al final y luego se pasa el modelo creado
module.exports = model( 'usuario', UsuarioSchema );
