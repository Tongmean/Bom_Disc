// monitorMiddleware.js
const morgan = require('morgan');
const os = require('os');
const process = require('process');
const si = require('systeminformation');

let responseTimes = [];
let startTime = Date.now();

// Middleware to log requests
const trafficLogger = morgan('combined');

// Middleware to track response time
const responseTimeTracker = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    responseTimes.push(duration);
    console.log(`Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode} | Response Time: ${duration}ms`);
  });
  next();
};

// Function to monitor system resources
const monitorSystem = () => {
  setInterval(() => {
    const cpuUsage = () => {
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;
  
      cpus.forEach(cpu => {
        for (let type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });
  
      return (1 - totalIdle / totalTick) * 100; // CPU usage in percentage
    };

    const memoryUsage1 = process.memoryUsage().rss / 1024 / 1024; // Memory usage in MB
    console.log(`CPU Load: ${cpuUsage().toFixed(2)}% | Memory Usage: ${memoryUsage1.toFixed(2)} MB`);
    const memoryUsage = process.memoryUsage();
    console.log("Memory Usage:");
    console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`);
    console.log("----------------------------")
    si.fsSize().then(data => {
      data.forEach(disk => {
        console.log(`Disk: ${disk.mount} | Total: ${(disk.size / 1024 / 1024 / 1024).toFixed(2)} GB | Used: ${(disk.used / 1024 / 1024 / 1024).toFixed(2)} GB | Free: ${(disk.available / 1024 / 1024 / 1024).toFixed(2)} GB`);
      });
    }).catch(error => {
      console.error('Error retrieving disk info:', error);
    });

    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`\n🚀 Average Response Time (Last 5s): ${avgResponseTime.toFixed(2)}ms\n`);
      responseTimes = []; // Reset array
    }

    // Calculate elapsed time
    let elapsedTime = Date.now() - startTime;
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    let days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

    console.log(`\n⏳ App Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`);
  }, 100000); // Monitor every 100 seconds (adjust as needed)
};

// Export middleware and monitoring function
module.exports = { trafficLogger, responseTimeTracker, monitorSystem };
