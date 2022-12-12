

const { response, request } = require('express')



const esAdminRole = ( req = request, res = response, next ) =>{

    
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin verificar el token primero',
        });
    };
    
    const { name, role } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } no es administrador - no puede hacer esto`
        });
    }

    next();
};




const tieneRole = ( ...roles ) => {

    //Esta funcion debe retornar otra
    return ( req = request, res = response, next ) =>{

        if ( req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin verificar el token primero',
            });
        };
        
        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: `El usuario requiere uno de estos roles ${ roles }`,
            });
        }

        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole,
}