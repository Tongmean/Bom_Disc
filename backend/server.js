//Call Express app
const express = require('express');
//Create app
const app = express();
const compression = require('compression');
//Call Cors
const cors = require('cors');
//Body Parser
const bodyParser = require('body-parser');
//Use middleware
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
// Serve static files from the 'Assets' folder
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
app.use(compression());

// const fs = require('fs'); // Import fs module
// // Load SSL certificate files
// const privateKey = fs.readFileSync('path/to/private.key', 'utf8');
// const certificate = fs.readFileSync('path/to/certificate.crt', 'utf8');
// const ca = fs.readFileSync('path/to/ca.crt', 'utf8');

// const credentials = { key: privateKey, cert: certificate, ca: ca };

const requireAuth = require('./middleware/requireAuth');
const UserRouter = require('./routes/userRoutes')
const Bomsrouter = require('./routes/BomRoutes');
const Filterrouter = require('./routes/FilterRoutes');
const packageRouter = require('./routes/packageRoutes');
const outerRouter = require('./routes/outerRoutes');
const additional_ToolRouter = require('./routes/additional_ToolRoutes');
const data_sheetRouter = require('./routes/data_sheetRoutes');
const shimRouter = require('./routes/shimRoutes');
const drawingRouter = require('./routes/drawingRoutes');
const productspecRouter = require('./routes/product_specRoutes');
const displayRouter = require('./routes/displayRoutes');
const drawingfileRouter = require('./routes/drawingfileRoutes');
const productspecfileRouter = require('./routes/productspecfileRoutes');
const emarkRouter = require('./routes/emarkRoutes');
const shimfileRouter = require('./routes/shimfileRoutes');
const materialRouter = require('./routes/materialRoutes');
//Utily-History-Log
const historylogRouter = require('./routes/historyRoutes');
const sellectedbomRouter = require('./routes/sellectedbomRoutes')

app.use('/api/user', UserRouter);
app.use('/api/bom',requireAuth, Bomsrouter);
app.use('/api/bomfilter',requireAuth, Filterrouter);
app.use('/api/package', requireAuth,packageRouter);
app.use('/api/outer', requireAuth, outerRouter);
app.use('/api/additionaltool', requireAuth, additional_ToolRouter);
app.use('/api/datasheet', requireAuth, data_sheetRouter);
app.use('/api/shim', requireAuth, shimRouter);
app.use('/api/drawing', requireAuth, drawingRouter);
app.use('/api/productspec', requireAuth, productspecRouter);
app.use('/api/historylog', requireAuth, historylogRouter);
app.use('/api/sellectedbom', requireAuth, sellectedbomRouter);
app.use('/api/display', requireAuth, displayRouter);
app.use('/api/file', requireAuth, drawingfileRouter);
app.use('/api/file', requireAuth, productspecfileRouter);
app.use('/api/file', requireAuth, shimfileRouter);
app.use('/api/emark', requireAuth, emarkRouter);
app.use('/api/material', requireAuth, materialRouter);

require('dotenv').config();
const port = process.env.PORT || 8001;
const host = "0.0.0.0";
//Listen require
app.listen(port, host,  (req, res)=>{

    console.log(`Backend running at http://${host}:${port}`);
    console.log("Server run on port:", port);
})