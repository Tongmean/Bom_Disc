const express = require('express');
const router = express.Router();
const { 
    getD_Weights,
    getD_Weight,
    postD_Weight,
    updateD_Weight
} =  require("../controller/D_Weight");

router.get('/', getD_Weights);
router.get('/:id', getD_Weight);
router.post('/create', postD_Weight);
router.put('/update/:id', updateD_Weight);



module.exports = router;