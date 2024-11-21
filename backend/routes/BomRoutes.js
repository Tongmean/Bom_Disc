const express = require('express');
const router = express.Router();
const { getBoms } =  require("../controller/Bomcontroller");

router.get('/',getBoms);


module.exports = router;