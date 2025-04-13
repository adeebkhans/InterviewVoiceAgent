require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const createSuperAdmin = async () => {
    try {
        // Super admin credentials - you can modify these or load from environment variables
        const superAdmin = {
            name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com',
            password: process.env.SUPER_ADMIN_PASSWORD || 'changeme123',
            role: 'super_admin'
        };

        // Check if super admin already exists
        const [existingAdmin] = await db.promise().query(
            'SELECT id FROM admins WHERE email = ?',
            [superAdmin.email]
        );

        if (existingAdmin.length > 0) {
            console.log('Super admin already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(superAdmin.password, salt);

        // Insert super admin
        await db.promise().query(
            'INSERT INTO admins (name, email, password, role, is_active) VALUES (?, ?, ?, ?, true)',
            [superAdmin.name, superAdmin.email, hashedPassword, superAdmin.role]
        );

        console.log('Super admin created successfully');
        console.log('Email:', superAdmin.email);
        console.log('Password:', superAdmin.password);

    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        db.end();
    }
};

// Run the script
createSuperAdmin(); 