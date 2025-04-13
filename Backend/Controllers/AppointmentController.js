const { pool } = require('../config/database');

class AppointmentController {
    // Create new appointment
    async createAppointment(req, res) {
        try {
            const { job_id, candidate_id, date_time, status } = req.body;
            
            // Convert ISO string to MySQL datetime format
            const formattedDateTime = new Date(date_time).toISOString().slice(0, 19).replace('T', ' ');
            
            const [result] = await pool.query(
                'INSERT INTO appointments (job_id, candidate_id, date_time, status) VALUES (?, ?, ?, ?)',
                [job_id, candidate_id, formattedDateTime, status || 'scheduled']
            );

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    job_id,
                    candidate_id,
                    date_time: formattedDateTime,
                    status: status || 'scheduled'
                },
                message: 'Appointment created successfully'
            });

        } catch (error) {
            console.error('Error in createAppointment:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating appointment',
                error: error.message
            });
        }
    }

    // Get all appointments
    async getAllAppointments(req, res) {
        try {
            const [appointments] = await pool.query(`
                SELECT 
                    a.*,
                    j.title as job_title,
                    c.name as candidate_name
                FROM appointments a
                JOIN jobs j ON a.job_id = j.id
                JOIN candidates c ON a.candidate_id = c.id
                ORDER BY a.date_time DESC
            `);

            // Format datetime for each appointment
            const formattedAppointments = appointments.map(apt => ({
                ...apt,
                date_time: new Date(apt.date_time).toISOString()
            }));

            res.json({
                success: true,
                data: formattedAppointments
            });

        } catch (error) {
            console.error('Error in getAllAppointments:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching appointments',
                error: error.message
            });
        }
    }

    // Get appointment by ID
    async getAppointmentById(req, res) {
        try {
            const [appointments] = await pool.query(`
                SELECT 
                    a.*,
                    j.title as job_title,
                    j.description as job_description,
                    j.requirements as job_requirements,
                    c.name as candidate_name,
                    c.phone as candidate_phone,
                    c.current_ctc as candidate_current_ctc,
                    c.expected_ctc as candidate_expected_ctc,
                    c.notice_period as candidate_notice_period,
                    c.experience as candidate_experience
                FROM appointments a
                JOIN jobs j ON a.job_id = j.id
                JOIN candidates c ON a.candidate_id = c.id
                WHERE a.id = ?
            `, [req.params.id]);

            if (appointments.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            // Format datetime
            const appointment = {
                ...appointments[0],
                date_time: new Date(appointments[0].date_time).toISOString()
            };

            res.json({
                success: true,
                data: appointment
            });

        } catch (error) {
            console.error('Error in getAppointmentById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching appointment details',
                error: error.message
            });
        }
    }

    // Update appointment status
    async updateAppointmentStatus(req, res) {
        try {
            const { status } = req.params;
            
            const [result] = await pool.query(
                'UPDATE appointments SET status = ? WHERE id = ?',
                [status, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            res.json({
                success: true,
                message: 'Appointment status updated successfully',
                data: {
                    id: parseInt(req.params.id),
                    status
                }
            });

        } catch (error) {
            console.error('Error in updateAppointmentStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating appointment status',
                error: error.message
            });
        }
    }

    // Get appointments by candidate ID
    async getAppointmentsByCandidate(req, res) {
        try {
            const [appointments] = await pool.query(`
                SELECT 
                    a.*,
                    j.title as job_title
                FROM appointments a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.candidate_id = ?
                ORDER BY a.date_time DESC
            `, [req.params.candidateId]);

            // Format datetime for each appointment
            const formattedAppointments = appointments.map(apt => ({
                ...apt,
                date_time: new Date(apt.date_time).toISOString()
            }));

            res.json({
                success: true,
                data: formattedAppointments
            });

        } catch (error) {
            console.error('Error in getAppointmentsByCandidate:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching candidate appointments',
                error: error.message
            });
        }
    }
}

module.exports = new AppointmentController(); 