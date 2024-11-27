const express = require('express');
const router = express.Router();
const { getProductspecs, getProductspec, postProductspec, updateProductspec} =  require("../controller/Product_speccontroller");

router.get('/',getProductspecs);
router.get('/:id',getProductspec);
router.post('/create', postProductspec);
router.put('/update/:id', updateProductspec);


module.exports = router;