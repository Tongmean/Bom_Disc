const express = require('express');
const router = express.Router();
const { getBoms,getBom, postBom, updateBom } =  require("../controller/Bomcontroller");

router.get('/',getBoms);
router.get('/:id',getBom);
router.post('/create', postBom);
router.put('/update/:id', updateBom);


module.exports = router;