const express = require('express');
const router = express.Router();
const {getShimfiles, getShimfile, uploadShimMiddleware, updateShimFile, createShimfile } =  require("../controller/Shimfilecontroller");

router.get('/shim', getShimfiles);
router.post('/shim/create', uploadShimMiddleware, createShimfile);
router.put('/shim/update/:id', uploadShimMiddleware, updateShimFile);
router.get('/shim/:id', getShimfile);




module.exports = router;