const express = require('express');
const router = express.Router();
const { getShims, getShim, postShim, updateShim } =  require("../controller/Shimcontroler");

router.get('/',getShims);
router.get('/:id',getShim);
router.post('/create', postShim);
router.put('/update/:id', updateShim);



module.exports = router;