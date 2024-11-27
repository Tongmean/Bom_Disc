const express = require('express');
const router = express.Router();
const { getDrawings, getDrawing, postDrawing, updateDrawing} =  require("../controller/Drawingcontroller");

router.get('/', getDrawings);
router.get('/:id', getDrawing);
router.post('/create', postDrawing);
router.put('/update/:id', updateDrawing);


module.exports = router;