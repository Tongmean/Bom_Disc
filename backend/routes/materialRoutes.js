const express = require('express');
const router = express.Router();
const { 
    getMaterials,
    getMaterial,
    postMaterial,
    updateMaterial
} =  require("../controller/Materialcontroller");


router.get('/', getMaterials);
router.get('/:id', getMaterial);
router.post('/create', postMaterial);
router.put('/update/:id', updateMaterial);



module.exports = router;