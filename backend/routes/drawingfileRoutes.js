const express = require('express');
const router = express.Router();
const { createDrawingFile, getDrawingfiles, uploadDrawingMiddleware, updateDrawingFile, getDrawingfile } =  require("../controller/Drawingfilecontroller");

router.get('/drawing', getDrawingfiles);
router.post('/drawing/create', uploadDrawingMiddleware, createDrawingFile);
router.put('/drawing/update/:id', uploadDrawingMiddleware, updateDrawingFile);
router.get('/drawing/:id', getDrawingfile);




module.exports = router;