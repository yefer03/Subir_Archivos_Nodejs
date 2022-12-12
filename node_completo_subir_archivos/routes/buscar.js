
const { Router } = require('express');

const { buscar } = require('../controllers/buscar');

router = Router();

//Se recibe la coleccion de mongo que quiere buscar y luego el temino
router.get('/:coleccion/:termino', buscar)



module.exports = router;