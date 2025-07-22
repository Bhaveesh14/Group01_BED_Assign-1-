const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, AppointmentController.create);
router.get('/', verifyToken, AppointmentController.getUserAppointments);
router.put('/:appointmentId', verifyToken, AppointmentController.update);
router.delete('/:appointmentId', verifyToken, AppointmentController.delete);

module.exports = router;
