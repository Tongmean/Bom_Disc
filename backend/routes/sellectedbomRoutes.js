const express = require('express');
const router = express.Router();
const { SelectedPackages, SelectedOuters, SelectedDatasheets,
    SelectedProductspecs,Selectedadditionalpackages, Selectedshims, Selecteddrawing
} =  require("../controller/SelecttedbomController");

router.get('/package', SelectedPackages);
router.get('/outer', SelectedOuters);
router.get('/datasheet', SelectedDatasheets);
router.get('/productspec', SelectedProductspecs);
router.get('/additionalpackage', Selectedadditionalpackages);
router.get('/shim', Selectedshims);
router.get('/drawing', Selecteddrawing);

module.exports = router;