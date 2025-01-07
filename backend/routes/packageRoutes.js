const express = require('express');
const router = express.Router();
const { getPackages, getPackage, postPackage, updatePackage, uploadPackageMiddleware } =  require("../controller/Packagecontroller");

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/create',uploadPackageMiddleware, postPackage);
router.put('/update/:id',uploadPackageMiddleware, updatePackage);



module.exports = router;