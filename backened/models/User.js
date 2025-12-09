const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'principal', 'teacher', 'student', 'parent'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// SIMPLIFIED: No middleware, no password hashing in model
// Password handling will be done in the controller

// SIMPLIFIED: Direct password comparison (for testing)
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        // Direct comparison - passwords are stored in plain text for now
        return enteredPassword === this.password;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);