//Call Express app
const express = require('express');
//Create app
const app = express();
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


const requireAuth = require('./middleware/requireAuth');
const UserRouter = require('./routes/userRoutes')
const Bomsrouter = require('./routes/BomRoutes');
const packageRouter = require('./routes/packageRoutes');
const outerRouter = require('./routes/outerRoutes');
const additional_ToolRouter = require('./routes/additional_ToolRoutes');
const data_sheetRouter = require('./routes/data_sheetRoutes');
const shimRouter = require('./routes/shimRoutes');
const drawingRouter = require('./routes/drawingRoutes');
const productspecRouter = require('./routes/product_specRoutes');
const displayRouter = require('./routes/displayRoutes');
const drawingfileRouter = require('./routes/drawingfileRoutes');
//Utily-History-Log
const historylogRouter = require('./routes/historyRoutes');
const sellectedbomRouter = require('./routes/sellectedbomRoutes')

app.use('/api/user', UserRouter);
app.use('/api/bom',requireAuth, Bomsrouter);
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

require('dotenv').config();
const port = process.env.PORT || 8001;
//Listen require
app.listen(port, (req, res)=>{


    console.log("Server run on port:", port);
})