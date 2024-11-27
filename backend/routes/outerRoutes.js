const express = require('express');
const router = express.Router();
const { getOuters, getOuter, postOuter, updateOuter } =  require("../controller/Outercontroller");

router.get('/', getOuters);
router.get('/:id', getOuter);
router.post('/create', postOuter);
router.put('/update/:id', updateOuter);



module.exports = router;