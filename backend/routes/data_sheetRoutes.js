const express = require('express');
const router = express.Router();
const { getDatasheet, getDatasheets, postDatasheet, updateDatasheet } =  require("../controller/Data_Sheetcontroller");

router.get('/', getDatasheets);
router.get('/:id', getDatasheet);
router.post('/create', postDatasheet);
router.put('/update/:id', updateDatasheet);




module.exports = router;