const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true
    },
    occupation: String,
    relationship: {
        type: String,
        default: 'Guardian'
    },
    address: {
        type: String,
        default: 'Address will be updated'
    },
    emergencyContact: String,
    
    // Store student information as embedded documents
    students: [
        {
            studentId: String,
            studentName: String,
            studentUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            studentProfileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
            },
            class: {
                classId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Class'
                },
                className: String,
                section: String
            },
            rollNumber: String,
            gender: String,
            dateOfBirth: Date,
            admissionDate: Date
        }
    ],
    
    totalStudents: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for better performance
parentSchema.index({ email: 1 });
parentSchema.index({ 'students.studentId': 1 });

module.exports = mongoose.model('Parent', parentSchema);