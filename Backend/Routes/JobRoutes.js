const express = require('express');
const router = express.Router();
const jobController = require('../Controllers/JobController');
const { authenticateAdmin, authorizeAdmin } = require('../Middleware/auth');

// Create a new job (Admin and super_admin only)
router.post('/', 
    authenticateAdmin, 
    authorizeAdmin(['admin', 'super_admin']), 
    jobController.createJob
);

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// Update job (Admin only)
router.put('/:id', authenticateAdmin, jobController.updateJob);

// Delete job (Admin only)
router.delete('/:id', authenticateAdmin, jobController.deleteJob);

module.exports = router;
