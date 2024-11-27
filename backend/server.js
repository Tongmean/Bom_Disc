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
//call database connection



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
//Utily-History-Log
const historylogRouter = require('./routes/historyRoutes');

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

require('dotenv').config();
const port = process.env.PORT || 8001;
//Listen require
app.listen(port, (req, res)=>{


    console.log("Server run on port:", port);
})