const express = require('express');
const router = express.Router();
const { SelectedPackages, SelectedOuters, SelectedDatasheets,
    SelectedProductspecs,Selectedadditionalpackages, Selectedshims, Selecteddrawing,
    SelectedmaterialWd,
    Selectedmaterialbp,
    Selectedmaterialsp
} =  require("../controller/SelecttedbomController");

router.get('/package', SelectedPackages);
router.get('/outer', SelectedOuters);
router.get('/datasheet', SelectedDatasheets);
router.get('/productspec', SelectedProductspecs);
router.get('/additionalpackage', Selectedadditionalpackages);
router.get('/shim', Selectedshims);
router.get('/drawing', Selecteddrawing);
router.get('/bp', Selectedmaterialbp);
router.get('/wd', SelectedmaterialWd);
router.get('/sp', Selectedmaterialsp);

module.exports = router;