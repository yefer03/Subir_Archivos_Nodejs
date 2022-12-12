

const jwt = require('jsonwebtoken');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) =>{

        //Se coloca en los argumentos las propiedades que se quieren guardar
        const payload = { uid };

        //Firmar un nuevo jwt
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' //Para definir por cuanto tiempo va a ser valido
        }, (err,token) =>{ //Callback que se dispara con un error o el token

            if ( err ) {
                console.log(err);
                reject(`Can't generate the token`)
            } else {
                resolve(token)
            };

        }); 
    });

};


module.exports = generarJWT;











