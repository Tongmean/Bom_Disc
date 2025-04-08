const express = require('express');
const path = require('path');
const app = express();
const io = require('@pm2/io');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler to return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.init({
    metrics: {
        http: true // Enable HTTP traffic monitoring
    }
});
const port = 3001;
const host = "0.0.0.0";
//Listen require
app.listen(port, host,  (req, res)=>{
  console.log(`Backend running at http://${host}:${port}`);
})
