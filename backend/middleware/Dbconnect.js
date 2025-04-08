const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool with connection details
const dbconnect = new Pool({
  // user: process.env.user,       // Your PostgreSQL username
  // host: process.env.host,            // Database host (e.g., localhost)
  // database: process.env.database,    // Your PostgreSQL database name
  // password: process.env.password,    // Your PostgreSQL password
  // port: process.env.port,                   // Default PostgreSQL port

  user: 'postgres',       // Your PostgreSQL username
  host: 'localhost',            // Database host (e.g., localhost)
  database: 'bom_Disc',    // Your PostgreSQL database name
  password: '15tongmean',    // Your PostgreSQL password
  port: 5432,                   // Default PostgreSQL port

  //   host: '192.168.4.200',            (Loptop Ip)

});
dbconnect.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connection to PostgreSQL successful!');
    release();  // Release the client back to the pool
  }
});


module.exports = dbconnect;