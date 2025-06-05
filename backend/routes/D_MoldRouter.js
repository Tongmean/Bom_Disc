const express = require('express');
const router = express.Router();
const { 
    getD_Molds,
    getD_Mold,
    postD_Mold,
    updateD_Mold
} =  require("../controller/D_Mold");

router.get('/', getD_Molds);
router.get('/:id', getD_Mold);
router.post('/create', postD_Mold);
router.put('/update/:id', updateD_Mold);



module.exports = router;