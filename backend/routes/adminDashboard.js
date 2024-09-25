const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminDb, queryPromise } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;

    try {
        const [admin] = await queryPromise(adminDb, 'SELECT * FROM admins WHERE username = ?', [username]);

        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign(
                { id: admin.id, username: admin.username, accessLevel: admin.access_level },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            console.log('Login successful for:', username);
            res.json({ success: true, token });
        } else {
            console.log('Login failed for:', username);
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;