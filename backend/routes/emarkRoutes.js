const express = require('express');
const router = express.Router();
const { getEmark, getEmarks, postEmark, updateEmark } =  require("../controller/Emarkcontroller");

router.get('/', getEmarks);
router.get('/:id', getEmark);
router.post('/create', postEmark);
router.put('/update/:id', updateEmark);



module.exports = router;