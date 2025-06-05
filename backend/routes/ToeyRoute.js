const express = require('express');
const router = express.Router();
const {    
    Qcgetmethod,
    Qcpostmethod } =  require("../controller/Toeycontroller");

router.get('/get', Qcgetmethod);
router.post('/post', Qcpostmethod);



module.exports = router;