const express = require('express');
const router = express.Router();
const { Homedisplay, Wipdisplay, Qcdisplay, Saledisplay } =  require("../controller/Displaycontroller");

router.get('/home', Homedisplay);
router.get('/wip', Wipdisplay);
router.get('/Qc', Qcdisplay);
router.get('/saledisplay', Saledisplay);



module.exports = router;