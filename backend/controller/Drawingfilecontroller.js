const dbconnect = require('../middleware/Dbconnect');
const { logUpdate } = require('../utility/updateLog');

// Update a file
const createDrawingFile = async (req, res) => {
    const userEmail = req.user.email; 
    const { file } = req; // Extract the uploaded file
    const { Drawing_No } = req.body; // Extract the drawing number

        //Check multer flies of array
    if (!req.files || req.files.length === 0) { // Check if files were uploaded
        return res.status(400).json({ msg: 'No files uploaded.'});
    }
    try {
        const sqlCommand = `
            INSERT INTO "drawingfile" 
            (drawing_no, unique_name, original_name, path, created_by) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`;
        const values = [
            Drawing_No, 
            file.filename, 
            file.originalname, 
            file.path, 
            userEmail
        ];
        const result = dbconnect.query(sqlCommand, values)
        res.status(200).json({ msg: 'Files uploaded successfully!', file: fileInfos , data:result}); // Send success response
    } catch (err) {
        console.error('Error inserting drawing file:', err.message);
        res.status(500).json({ msg: 'Error uploading files' }); 
        console.log("drawing", err)
    }
};

module.exports = {
    createDrawingFile,
};
