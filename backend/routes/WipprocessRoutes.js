const express = require('express');
const router = express.Router();
const { 
    getWips,
    getWip,
    postWip,
    updateWip  
} =  require("../controller/Wipprocess");

router.get('/', getWips);
router.get('/:id', getWip);
router.post('/create', postWip);
router.put('/update/:id', updateWip);



module.exports = router;