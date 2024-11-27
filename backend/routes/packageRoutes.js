const express = require('express');
const router = express.Router();
const { getPackages, getPackage, postPackage, updatePackage } =  require("../controller/Packagecontroller");

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/create', postPackage);
router.put('/update/:id', updatePackage);



module.exports = router;