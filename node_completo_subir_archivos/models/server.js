
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');


class Server {

    constructor(){

        //Crea la aplicacion de express
        this.app = express();

        //Llama la variable port del .env para hacerla visible para todos
        this.port = process.env.PORT;

        //Ruta en un string para que sea mas facil de leer *opcional*

        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            uploads:    '/api/uploads',
            users:      '/api/user',
            products:   '/api/products',
            search:     '/api/search',
        };

        // this.usuariosPath =  '/api/user';
        // this.authPath =      '/api/auth';
        // this.categoriesPath ='/api/categories';


        //Conexion a la base de datos
        this.conectarDB();

        //Ejecuta el metodo de middlewares
        //Middlewares
        //Son funciones que van agregando funcionalidades al webserver
        this.middlewares();

        //Ejecuta las rutas
        this.routes();

    };


    async conectarDB(){
        await dbConnection();
    };


    middlewares(){

        //Cors
        this.app.use( cors() );

        //Lectura y parse del body
        this.app.use( express.json() );

        //Directorio publcio
        this.app.use( express.static('public') );

        //Middleware para manejar la carga de archivos
        this.app.use( fileUpload ({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));    

    };


    routes(){

        //P1: Se declara la ruta a la que se le va a hacer
        //P2 se coloca la ruta de donde vienen las rutas
        
        this.app.use(this.paths.auth,       require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.users,      require('../routes/users'));
        this.app.use(this.paths.products,   require('../routes/products'));
        this.app.use(this.paths.search,     require('../routes/buscar'));
        this.app.use(this.paths.uploads,     require('../routes/uploads'));
        
    };


    listen(){

        this.app.listen( this.port, () => console.log( 'Server running on port', this.port ) );
        
    };

};


module.exports = Server;