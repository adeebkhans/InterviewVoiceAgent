const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
};

class AuthController {
    // Admin login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Remove .promise() since we're already using mysql2/promise
            const [admins] = await pool.query(
                'SELECT * FROM admins WHERE email = ? AND is_active = true',
                [email]
            );

            if (admins.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const admin = admins[0];

            // Compare password
            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // JWT token
            const token = jwt.sign(
                {
                    adminId: admin.id,
                    role: admin.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Set cookie
            res.cookie('token', token, cookieOptions);

            res.status(200).json({
                success: true,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login',
                error: error.message
            });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error during logout',
                error: error.message
            });
        }
    }

    // Create admin (super_admin only)
    async createAdmin(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Remove .promise() here as well
            const [result] = await pool.query(
                'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role]
            );

            res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                adminId: result.insertId
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating admin',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
