const express = require('express');
const router = express.Router();
const {Getdworwip} =  require("../controller/Framecontroller");

router.post('/', Getdworwip);



module.exports = router;