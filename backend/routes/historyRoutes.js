const express = require('express');
const router = express.Router();
const {getEmarklog, getProductspecfilelog, getBomlog, getPackagelog, getOuterlog, getAdditionalpackagelog, getDatasheetlog,getShimlog, getDrawinglog, getProductspeclog, getDrawingfilelog } =  require("../controller/Historylog");

router.get('/bom/:id',getBomlog);
router.get('/package/:id',getPackagelog);
router.get('/outer/:id',getOuterlog);
router.get('/additionalpackage/:id',getAdditionalpackagelog);
router.get('/datasheet/:id',getDatasheetlog);
router.get('/shim/:id',getShimlog);
router.get('/drawing/:id', getDrawinglog);
router.get('/productspec/:id', getProductspeclog);
router.get('/drawingfile/:id', getDrawingfilelog);
router.get('/productspecfile/:id', getProductspecfilelog);
router.get('/emark/:id', getEmarklog);


module.exports = router;