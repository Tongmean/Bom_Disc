const express = require('express');
const router = express.Router();
const { 
    getD_Chemgrades,
    getD_Chemgrade,
    postD_Chemgrade,
    updateD_Chemgrade
} =  require("../controller/D_Chemgrade");

router.get('/', getD_Chemgrades);
router.get('/:id', getD_Chemgrade);
router.post('/create', postD_Chemgrade);
router.put('/update/:id', updateD_Chemgrade);



module.exports = router;