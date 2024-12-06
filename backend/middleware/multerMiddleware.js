const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs module
// Ensure the directory exists for file uploads
const uploadDir = path.join(__dirname, '../Assets', 'Drawing');
fs.mkdirSync(uploadDir, { recursive: true }); // Create 'Asset/Drawing' directory if it doesn't exist

// Configure Multer for file storage
const storage = multer.diskStorage({
    // Define destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files in 'Asset/Drawing' folder
    },
    // Define the filename for uploaded files
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}`; // Create a unique filename
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // Convert from latin1 to UTF-8
        cb(null, `${originalName}-${uniqueSuffix}`); // Append original filename to unique identifier
    }
    
});

// File filter for PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});

const uploadMidleware = upload.single('file');

module.exports = {
    uploadMidleware
};
