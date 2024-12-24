const dbconnect = require('../middleware/Dbconnect');
const jwt = require('jsonwebtoken');
//Get All user
const getUsers = async (req, res) => {
    try {
        dbconnect.query('SELECT * FROM "users"', (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "ดึงข้อมูลผู้ใช้งานไม่สำเร็จ",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true, // Changed from false to true to indicate success
                    msg: "ดึงข้อมูลผู้ใช้งานได้สำเร็จ",
                    data: result.rows // PostgreSQL query result has a 'rows' property
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};

//Get single user
const getSingleUser = async (req, res) => {
    const id = req.params.id;
    const sqlCommand = 'SELECT * FROM "users" WHERE "id" = $1';
    try {
        dbconnect.query(sqlCommand, [id], (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: 'ดึงข้อมูลผู้ใช้งานไม่สำเร็จ.',
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: 'ดึงงข้อมูลผู้ใช้งานได้สำเร็จ',
                    data: result.rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'มีปัญาเกิดขึ้นระว่างการดึงข้อมูล. กรุณาลองอีกครั้ง.',
            data: error
        });
    }
};

//Create user
const createUser = async (req, res) => {
    const { email, password, role, permission1, permission2, permission3, permission4 } = req.body;
    try {
        // Check if email already exists
        dbconnect.query('SELECT "email" FROM "users" WHERE "email" = $1', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: 'มีผิดพลาดระหว่างการตรวจสอบ, รบกวนพยายามอีกครั้ง',
                    data: err
                });
            }

            if (result.rows.length > 0) {
                // Email already exists
                return res.status(400).json({
                    success: false,
                    msg: 'อีเมลมีในระบบอยู่แล้ว. กรุณาเปลี่ยนอีเมล',
                });
            }

            // Hash password
            // const hashpassword = await bcrypt.hash(password, 10);
            
            // Insert new user into the database
            dbconnect.query('INSERT INTO "users"("email", "password", "role", "permission1", "permission2", "permission3", "permission4") VALUES($1, $2, $3, $4, $5, $6, $7)', 
            [email, password, role, permission1, permission2, permission3, permission4], 
            (err, result) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        msg: 'การลงทะเบียนไม่สำเร็จ. กรุณาพยายามอีกครั้ง',
                        data: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        msg: "คุณได้ลงทะเบียนสำเร็จแล้ว.",
                        data: result.rows
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'การลงทะเบียนไม่สำเร็จ. กรุณาพยายามอีกครั้ง',
            data: error
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(401).json({ msg: 'Email and password are required' });
        }

        const sql = 'SELECT * FROM "users" WHERE "email" = $1';
        dbconnect.query(sql, [email], (err, result) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ msg: 'Database query error' });
            }

            // Check if user exists
            if (result.rows.length === 0) {
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Get user from database
            const user = result.rows[0];

            // Compare passwords (assuming no hashing, raw password comparison)
            if (password !== user.password) {
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Generate JWT token (Include id, email in object)
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });

            // Respond with the token
            res.status(200).json({ token: token, data: user });
            // console.log('token', token);
            // console.log('user', user);
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Error logging in' });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { email, password, role, permission1, permission2, permission3, permission4 } = req.body; // Ensure role is included in the request body

    try {
        const sqlCommand = `UPDATE "users" SET email = $1, password = $2, role = $3, permission1 = $4, permission2 = $5, permission3 = $6, permission4 = $7 WHERE id = $8`;
        const values = [email, password, role, permission1, permission2, permission3, permission4, id]; // Add id to the values array
        
        dbconnect.query(sqlCommand, values, (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(400).json({
                    success: false,
                    data: err,
                    msg: "มีข้อผิดพลาดระหว่างการอัพเดทผู้ใช้งาน กรุณาลองอีกครั้ง"
                });
            }

            if (result.rowCount === 0) { // Handle case where no user was updated
                return res.status(404).json({
                    success: false,
                    data: {},
                    msg: "ไม่พบผู้ใช้งานที่ต้องการอัพเดท"
                });
            }

            res.status(200).json({
                success: true,
                data: result.rows,
                msg: "การอัพเดทข้อมูลผู้ใช้งานสำเร็จแล้ว!"
            });
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            data: error,
            msg: "มีข้อผิดพลาดระหว่างการอัพเดทผู้ใช้งาน กรุณาลองอีกครั้ง"
        });
    }
};


module.exports ={
    getUsers,
    createUser,
    login,
    getSingleUser,
    updateUser
}