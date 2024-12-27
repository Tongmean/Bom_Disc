const express = require('express');
const router = express.Router();
const { getFilterboms, getFilterbomsbycodefg, getFiltermaterialbycompactnodrawing, getFiltermaterialfordrawing, getFiltermaterialbycompactnoshim, getFiltermaterialforshim } =  require("../controller/Filtercontroller");

router.get('/',getFilterboms);
router.post('/', getFilterbomsbycodefg);
router.get('/drawing',getFiltermaterialfordrawing);
router.post('/drawing', getFiltermaterialbycompactnodrawing);
router.get('/shim',getFiltermaterialforshim);
router.post('/shim', getFiltermaterialbycompactnoshim);


module.exports = router;