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





require('dotenv').config();
const port = process.env.PORT || 8001;
//Listen require
app.listen(port, (req, res)=>{


    console.log("Server run on port:", port);
})