require('dotenv').config();


const Server = require('./models/server');

//Crea la instancia del servidor
const server = new Server();

//Pone en funcionamient o el servidor
server.listen();

