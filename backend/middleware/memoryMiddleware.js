// memoryMiddleware.js

function memoryLimitMiddleware(req, res, next) {
    // Set the interval to check memory every 10 seconds
    setInterval(() => {
        const usage = process.memoryUsage();
        const heapUsedMB = (usage.heapUsed / 1024 / 1024).toFixed(2); // Current heap usage in MB
        const maxHeapLimitMB = 1500; // Max heap memory limit (1500MB)

        // Calculate how much memory is remaining from the max limit
        const memoryLeft = maxHeapLimitMB - heapUsedMB;

        console.log(`Heap Used: ${heapUsedMB} MB`);
        console.log(`Memory Left: ${memoryLeft} MB from the 1500 MB limit`);
        // If memory exceeds the limit (10000MB), exit the process
        if (heapUsedMB > maxHeapLimitMB) {
            console.log("Memory limit exceeded! clear memory...");
            // process.exit(1); // Exit the process to trigger a restart by nodemon
            // setTimeout(() => {
            //     console.log("Memory limit exceeded! Restarting...");
            //     process.exit(1); // Delay the exit to allow for proper restart
            // }, 2000); // 2-second delay
            if (global.gc) {
                console.log("Force garbage collection...");
                global.gc();
                process.exit(1)
            }
            // Log current memory usage after GC
            const usageAfterGC = process.memoryUsage();
            const heapUsedAfterGCMB = (usageAfterGC.heapUsed / 1024 / 1024).toFixed(2);
            console.log(`Heap Used After GC: ${heapUsedAfterGCMB} MB`);
        }

    }, 1000000); // Check every 100 seconds

    next(); // Continue to the next middleware or route handler
}

module.exports = memoryLimitMiddleware;

// "start": "nodemon --legacy-watch --exec \"node server.js\""