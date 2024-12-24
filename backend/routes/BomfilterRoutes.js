const express = require('express');
const router = express.Router();
const { getFilterboms, getFilterbomsbycodefg } =  require("../controller/BomFiltercontroller");

router.get('/',getFilterboms);
// router.get('/:id',getBom);
router.post('/', getFilterbomsbycodefg);
// router.put('/update/:id', updateBom);


module.exports = router;