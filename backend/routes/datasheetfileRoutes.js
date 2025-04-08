const express = require('express');
const router = express.Router();
const {getdatasheetfiles, getDatasheetfile, uploadDatasheetMiddleware, updateShimFile, createDatasheetfile } =  require("../controller/datasheetfilecontroller");

router.get('/datasheet', getdatasheetfiles);
router.get('/datasheet/:id', getDatasheetfile);
router.post('/datasheet/create', uploadDatasheetMiddleware, createDatasheetfile);
router.put('/datasheet/update/:id', uploadDatasheetMiddleware, updateShimFile);
// router.get('/shim/:id', getShimfile);




module.exports = router;