const express = require('express');
const router = express.Router();
const { getBomlog, getPackagelog, getOuterlog, getAdditionalpackagelog, getDatasheetlog,getShimlog, getDrawinglog, getProductspeclog } =  require("../controller/Historylog");

router.get('/bom/:id',getBomlog);
router.get('/package/:id',getPackagelog);
router.get('/outer/:id',getOuterlog);
router.get('/additionalpackage/:id',getAdditionalpackagelog);
router.get('/datasheet/:id',getDatasheetlog);
router.get('/shim/:id',getShimlog);
router.get('/drawing/:id', getDrawinglog);
router.get('/productspec/:id', getProductspeclog);


module.exports = router;