const express = require('express');
const router = express.Router();
const { getaddtionaltool, getaddtionaltools, postAdditionaltools, updateAdditionaltool } =  require("../controller/Additional_Toolcontroller");

router.get('/',getaddtionaltools);
router.get('/:id',getaddtionaltool);
router.post('/create',postAdditionaltools);
router.put('/update/:id',updateAdditionaltool);



module.exports = router;