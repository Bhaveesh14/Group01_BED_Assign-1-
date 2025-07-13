const express = require('express');
const router = express.Router();
const userController = require('../controllers_Temp/userController');
const validateUserUpdate = require('../middleware/validateUserUpdate');

router.get('/user/:id', userController.getUser);
router.put('/user/:id', validateUserUpdate, userController.updateUser);

module.exports = router;
