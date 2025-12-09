const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const jwt = require('jsonwebtoken');
const generatePassword = require('../utils/generatePassword');
const emailService = require('../utils/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, address } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            address
        });

        if (user) {
            const token = generateToken(user._id);
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        
        if (user && (await user.matchPassword(password))) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = generateToken(user._id);
            
            // Get additional profile data based on role
            let profile = {};
            switch (user.role) {
                case 'student':
                    profile = await Student.findOne({ user: user._id }).populate('class');
                    break;
                case 'teacher':
                    profile = await Teacher.findOne({ user: user._id });
                    break;
                case 'parent':
                    profile = await Parent.findOne({ user: user._id }).populate('students');
                    break;
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        let profile = {};
        switch (user.role) {
            case 'student':
                profile = await Student.findOne({ user: user._id })
                    .populate('class')
                    .populate('parent');
                break;
            case 'teacher':
                profile = await Teacher.findOne({ user: user._id })
                    .populate('subjects')
                    .populate('classes');
                break;
            case 'parent':
                profile = await Parent.findOne({ user: user._id })
                    .populate({
                        path: 'students',
                        populate: {
                            path: 'class',
                            model: 'Class'
                        }
                    });
                break;
        }

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                profilePicture: user.profilePicture
            },
            profile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = generateToken(user._id);
        
        // Send email with reset link
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        
        await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};