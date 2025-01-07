const express = require('express');
const router = express.Router();
const { SelectedPackages, SelectedOuters, SelectedDatasheets,
    SelectedProductspecs,Selectedadditionalpackages, Selectedshims, Selecteddrawing,
    SelectedmaterialWd,
    Selectedmaterialbp,
    Selectedmaterialsp,
    Selectedemark,
    Selectedrmpk
} =  require("../controller/SelecttedbomController");

router.get('/package', SelectedPackages);
router.get('/outer', SelectedOuters);
router.get('/datasheet', SelectedDatasheets);
router.get('/productspec', SelectedProductspecs);
router.get('/additionalpackage', Selectedadditionalpackages);
router.get('/shim', Selectedshims);
router.get('/drawing', Selecteddrawing);
router.get('/emark', Selectedemark);

router.get('/bp', Selectedmaterialbp);
router.get('/wd', SelectedmaterialWd);
router.get('/sp', Selectedmaterialsp);
router.get('/rmpk', Selectedrmpk);

module.exports = router;