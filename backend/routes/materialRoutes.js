const express = require('express');
const router = express.Router();
const { 
    getMaterials,
    getMaterial,
    postMaterial,
    updateMaterial,
    uploadMaterialMiddleware
} =  require("../controller/Materialcontroller");


router.get('/', getMaterials);
router.get('/:id', getMaterial);
router.post('/create',uploadMaterialMiddleware, postMaterial);
router.put('/update/:id',uploadMaterialMiddleware, updateMaterial);



module.exports = router;