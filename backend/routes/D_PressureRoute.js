const express = require('express');
const router = express.Router();
const { 
    getD_Pressures,
    getD_Pressure,
    postD_Pressure,
    updateD_Pressure
} =  require("../controller/D_Pressure");

router.get('/', getD_Pressures);
router.get('/:id', getD_Pressure);
router.post('/create', postD_Pressure);
router.put('/update/:id', updateD_Pressure);



module.exports = router;