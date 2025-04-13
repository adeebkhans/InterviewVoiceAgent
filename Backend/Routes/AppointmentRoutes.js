const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/AppointmentController');
const { authenticateAdmin } = require('../Middleware/auth');

// Create a new appointment
router.post('/', authenticateAdmin, appointmentController.createAppointment);

// Get all appointments
router.get('/', authenticateAdmin, appointmentController.getAllAppointments);

// Get specific appointment
router.get('/:id', authenticateAdmin, appointmentController.getAppointmentById);

// Update appointment status
router.patch('/:id/:status', authenticateAdmin, appointmentController.updateAppointmentStatus);

// Get appointments by candidate
router.get('/candidate/:candidateId', authenticateAdmin, appointmentController.getAppointmentsByCandidate);

module.exports = router; 