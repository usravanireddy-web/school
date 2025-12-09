const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration request received');
        const { name, email, password, role, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !phone || !address) {
            return res.status(400).json({ 
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            address
        });

        console.log('✅ User registered successfully:', email);
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: 'Registration failed: ' + error.message });
    }
});

// POST /api/auth/login - SIMPLE LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        
        if (user) {
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {
                // Update last login
                user.lastLogin = new Date();
                await user.save();

                console.log('🎉 Login successful for:', user.email);
                
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    message: 'Login successful'
                });
            } else {
                console.log('❌ Invalid password');
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            console.log('❌ User not found');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('💥 LOGIN ERROR:', error);
        res.status(500).json({ message: 'Login failed: ' + error.message });
    }
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
    try {
        res.json({ message: 'Profile endpoint - no authentication required' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Auth routes are working! (No JWT)'
    });
});

module.exports = router;