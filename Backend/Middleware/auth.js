const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const [admins] = await pool.query(
            'SELECT id, email, name, role FROM admins WHERE id = ? AND is_active = true',
            [decoded.adminId]
        );
        console.log('Admin Fetched:', admins[0]);

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Admin not found.'
            });
        }

        req.admin = admins[0];
        next();

    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token or authentication error.',
            error: error.message
        });
    }
};

const authorizeAdmin = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Not authenticated.'
            });
        }

        if (!allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateAdmin,
    authorizeAdmin
};
