const express = require('express');
const router = express.Router();
const { getUsers, createUser, login, getSingleUser, updateUser } =  require("../controller/Usercontroller");

router.get('/',getUsers);
router.get('/:id',getSingleUser);
router.post('/create',createUser);
router.post('/login',login);
router.put('/update/:id',updateUser);


module.exports = router;