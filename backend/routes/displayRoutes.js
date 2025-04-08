const express = require('express');
const router = express.Router();
const { Homedisplay, Wipdisplay, Qcdisplay, Saledisplay, componentdisplay } =  require("../controller/Displaycontroller");

router.get('/home', Homedisplay);
router.get('/wip', Wipdisplay);
router.get('/Qc', Qcdisplay);
router.get('/saledisplay', Saledisplay);
router.get('/component', componentdisplay);



module.exports = router;