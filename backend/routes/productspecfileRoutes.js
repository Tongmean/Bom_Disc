const express = require('express');
const router = express.Router();
const { createProductspecFile, getProductspecfile , getProductspecfiles, uploadProductspecMiddleware, updateProductspecFile } =  require("../controller/Productspecfilecontroller");

router.get('/productspec', getProductspecfiles);
router.post('/productspec/create', uploadProductspecMiddleware, createProductspecFile);
router.put('/productspec/update/:id', uploadProductspecMiddleware, updateProductspecFile);
router.get('/productspec/:id', getProductspecfile);




module.exports = router;