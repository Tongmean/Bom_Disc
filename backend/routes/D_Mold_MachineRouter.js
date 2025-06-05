const express = require('express');
const router = express.Router();
const { 
    getD_Machine_Molds,
    getD_Machine_Mold,
    postD_Machine_Mold,
    postmultipleD_Machine_Mold,
    updateD_Machine_Mold
} =  require("../controller/D_Mold_Machine");

router.get('/', getD_Machine_Molds);
router.get('/:id', getD_Machine_Mold);
router.post('/create', postD_Machine_Mold);
router.post('/createmultiple', postmultipleD_Machine_Mold);
router.put('/update/:id', updateD_Machine_Mold);



module.exports = router;