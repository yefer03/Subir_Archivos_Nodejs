

//Es una importacion propia de node que se usa para crear url   
const path = require('path');
const { v4: uuidv4 } = require('uuid');



const subirArchivo = ( files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif',], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        //Validar la extencion
        if ( !extencionesValidas.includes( extension ) ) {
            return reject(`La extención ${ extension } no es valida -- ${ extencionesValidas }`);
        };

        //La funcion uuidv4 genera un id para y se le concatena el punto y la extension
        const nombreTemporal = uuidv4() + '.' + extension;

        //Crea la ruta donde se va a almacenar el archivo a guardar
        //El primer argumento se deja igual, el segundo es la carpeta
        //Y el tercero es el nombre del archivo
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemporal );
    
        archivo.mv(uploadPath, (err) => {

            if (err) {
                reject(err);
            };
            resolve( nombreTemporal );

        });
    });
};


module.exports = {
    subirArchivo
};