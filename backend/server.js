//Call Express app
const express = require('express');
//Create app
const app = express();
const compression = require('compression');
//Call Cors
const cors = require('cors');
//Body Parser
const bodyParser = require('body-parser');

const fs = require('fs');
const { trafficLogger, responseTimeTracker, monitorSystem } = require('./middleware/monitorMiddleware');
const memoryLimitMiddleware = require('./middleware/memoryMiddleware');

// Use monitoring middleware
// app.use(trafficLogger);
app.use(responseTimeTracker);
//Calculate left Memory
app.use(memoryLimitMiddleware);

// Start system monitoring
monitorSystem();


//Use middleware
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
// Serve static files from the 'Assets' folder
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
app.use(compression());
//Access Manually path
const AssetsPath = path.join(__dirname, 'Assets');
// Serve static files from the 'Assets' directory
app.use('/Assets', express.static(AssetsPath));
// Enable directory listing
app.get('/Assets/*?', (req, res) => {
    let requestedPath = req.params[0] || '';
    let dirPath = path.join(AssetsPath, requestedPath);

    // Prevent directory traversal attack
    if (!dirPath.startsWith(AssetsPath)) {
        return res.status(400).send('Invalid path');
    }

    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        
        let fileList = files.map(file => {
            let href = `/Assets/${requestedPath ? requestedPath + '/' : ''}${file.name}`;
            return `<a href="${href}">${file.name}${file.isDirectory() ? '/' : ''}</a>`;
        }).join('<br>');

        res.send(`<h2>Available Files:</h2>${fileList}`);
    });
});




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
const datasheetfileRouter = require('./routes/datasheetfileRoutes');
const materialRouter = require('./routes/materialRoutes');
const wipRouter = require('./routes/WipprocessRoutes')
//Data-sheet-revise
const machineRouter = require('./routes/D_MachineRouter')
const moldRouter = require('./routes/D_MoldRouter')
const chemgradeRouter = require('./routes/D_ChemgradeRouter')
const weightRouter = require('./routes/D_WeightRoute')
const pressureRouter = require("./routes/D_PressureRoute")
const MoldmachineRouter = require('./routes/D_Mold_MachineRouter')
const dsellectedRouter = require('./routes/D_Sellected')
//Utily-History-Log
const historylogRouter = require('./routes/historyRoutes');
const sellectedbomRouter = require('./routes/sellectedbomRoutes')
//Frame Api
const frameRouter = require('./routes/frameRoute')
const toeyRouter = require('./routes/ToeyRoute')

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
app.use('/api/file', requireAuth, datasheetfileRouter);
app.use('/api/emark', requireAuth, emarkRouter);
app.use('/api/material', requireAuth, materialRouter);
app.use('/api/wip', requireAuth, wipRouter);
app.use('/api/frame', frameRouter);
app.use('/api/toey', toeyRouter);

app.use('/api/data-sheet/machine', requireAuth, machineRouter);
app.use('/api/data-sheet/mold', requireAuth, moldRouter);
app.use('/api/data-sheet/chemgrade', requireAuth, chemgradeRouter);
app.use('/api/data-sheet/weight', requireAuth, weightRouter);
app.use('/api/data-sheet/pressure', requireAuth, pressureRouter);
app.use('/api/data-sheet/moldmachine', requireAuth, MoldmachineRouter);
app.use('/api/data-sheet/sellect', requireAuth, dsellectedRouter);





require('dotenv').config();
const port = process.env.PORT || 8001;
const host = "0.0.0.0";
//Listen require
app.listen(port, host,  (req, res)=>{

    // setTimeout(() => {
    //     throw new Error("Simulated crash");
    // }, 2000);

    console.log(`Backend running at http://${host}:${port}`);
    console.log("Server run on port:", port);
});