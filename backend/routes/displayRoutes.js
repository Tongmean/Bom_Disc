const express = require('express');
const router = express.Router();
const { Homedisplay, Wipdisplay } =  require("../controller/Displaycontroller");

router.get('/home', Homedisplay);
router.get('/wip', Wipdisplay);



module.exports = router;