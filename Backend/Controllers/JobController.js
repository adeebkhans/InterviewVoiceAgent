const { pool } = require('../config/database');
const createJobTable = require('../Schema/JobSchema.js');

// Controller for Job operations
class JobController {
    // Create a new job
    async createJob(req, res) {
        try {
            const { title, description, requirements } = req.body;
            
            // Ensure requirements is stored as a JSON string
            const requirementsJson = typeof requirements === 'string' 
                ? requirements 
                : JSON.stringify(requirements);

            const [result] = await pool.query(
                'INSERT INTO jobs (title, description, requirements) VALUES (?, ?, ?)',
                [title, description, requirementsJson]
            );

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    title,
                    description,
                    requirements: JSON.parse(requirementsJson)
                },
                message: 'Job created successfully'
            });

        } catch (error) {
            console.error('Error in createJob:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating job',
                error: error.message
            });
        }
    }

    // Get all jobs
    async getAllJobs(req, res) {
        try {
            const [jobs] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
            
            // Safely parse requirements for each job
            const formattedJobs = jobs.map(job => {
                let parsedRequirements = [];
                try {
                    parsedRequirements = typeof job.requirements === 'string' 
                        ? JSON.parse(job.requirements)
                        : job.requirements;
                } catch (err) {
                    console.error(`Error parsing requirements for job ${job.id}:`, err);
                    parsedRequirements = []; // Fallback to empty array if parsing fails
                }

                return {
                    ...job,
                    requirements: parsedRequirements
                };
            });

            res.json({
                success: true,
                data: formattedJobs
            });

        } catch (error) {
            console.error('Error in getAllJobs:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching jobs',
                error: error.message
            });
        }
    }

    // Get job by ID
    async getJobById(req, res) {
        try {
            const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);

            if (jobs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            // Safely parse requirements
            let parsedRequirements = [];
            try {
                parsedRequirements = typeof jobs[0].requirements === 'string' 
                    ? JSON.parse(jobs[0].requirements)
                    : jobs[0].requirements;
            } catch (err) {
                console.error('Error parsing requirements:', err);
            }

            const job = {
                ...jobs[0],
                requirements: parsedRequirements
            };

            res.json({
                success: true,
                data: job
            });

        } catch (error) {
            console.error('Error in getJobById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching job details',
                error: error.message
            });
        }
    }

    // Update job
    async updateJob(req, res) {
        try {
            const { title, description, requirements } = req.body;
            
            // Ensure requirements is stored as a JSON string
            const requirementsJson = typeof requirements === 'string' 
                ? requirements 
                : JSON.stringify(requirements);

            const [result] = await pool.query(
                'UPDATE jobs SET title = ?, description = ?, requirements = ? WHERE id = ?',
                [title, description, requirementsJson, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            res.json({
                success: true,
                message: 'Job updated successfully',
                data: {
                    id: parseInt(req.params.id),
                    title,
                    description,
                    requirements: JSON.parse(requirementsJson)
                }
            });

        } catch (error) {
            console.error('Error in updateJob:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating job',
                error: error.message
            });
        }
    }

    // Delete job
    async deleteJob(req, res) {
        try {
            const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Job not found'
                });
            }

            res.json({
                success: true,
                message: 'Job deleted successfully'
            });

        } catch (error) {
            console.error('Error in deleteJob:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting job',
                error: error.message
            });
        }
    }
}

module.exports = new JobController();


