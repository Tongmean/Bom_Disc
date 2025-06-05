const express = require('express');
const router = express.Router();
const { 
    getD_Machines,
    getD_Machine,
    postD_Machine,
    updateD_Machine
} =  require("../controller/D_Machine");

router.get('/', getD_Machines);
router.get('/:id', getD_Machine);
router.post('/create', postD_Machine);
router.put('/update/:id', updateD_Machine);



module.exports = router;