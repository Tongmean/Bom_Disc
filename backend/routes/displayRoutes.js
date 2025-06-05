const express = require('express');
const router = express.Router();
const {Wiptostoredisplay, Homedisplay, Wipdisplay, Qcdisplay, Saledisplay, componentdisplay, datasheetdisplay } =  require("../controller/Displaycontroller");

router.get('/home', Homedisplay);
router.get('/wip', Wipdisplay);
router.get('/wiptostore', Wiptostoredisplay);
router.get('/Qc', Qcdisplay);
router.get('/saledisplay', Saledisplay);
router.get('/component', componentdisplay);
router.get('/datasheetdisplay', datasheetdisplay);



module.exports = router;