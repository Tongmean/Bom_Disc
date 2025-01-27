const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler to return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
