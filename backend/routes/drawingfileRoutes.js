const express = require('express');
const router = express.Router();
const { uploadMidleware } = require('../middleware/multerMiddleware');
const { createDrawingFile } =  require("../controller/Drawingfilecontroller");

router.post('/drawing',uploadMidleware, createDrawingFile);




module.exports = router;