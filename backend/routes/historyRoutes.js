const express = require('express');
const router = express.Router();
const {getDatasheetfilelog, getMateriallog, getShimfilelog, getEmarklog, getProductspecfilelog, getBomlog, getPackagelog, getOuterlog, getAdditionalpackagelog, getDatasheetlog,getShimlog, getDrawinglog, getProductspeclog, getDrawingfilelog ,
    getD_Machinelog,
    getD_Moldlog,
    getD_Chemgradelog,
    getD_Weightlog,
    getD_Mold_Machinelog,
    getWipprocesslog,
    getD_Pressurelog
} =  require("../controller/Historylog");



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
router.get('/shimfile/:id', getShimfilelog);
router.get('/material/:id', getMateriallog);
router.get('/datasheetfile/:id', getDatasheetfilelog);

router.get('/data-sheet/machine/:id',getD_Machinelog);
router.get('/data-sheet/mold/:id',getD_Moldlog);
router.get('/data-sheet/chemgrade/:id',getD_Chemgradelog);
router.get('/data-sheet/weight/:id',getD_Weightlog);
router.get('/data-sheet/moldmachine/:id',getD_Mold_Machinelog);
router.get('/data-sheet/pressure/:id',getD_Pressurelog);

router.get('/Wipprocess/:id', getWipprocesslog);

module.exports = router;