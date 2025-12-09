const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherId: {
        type: String,
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    subjects: [{
        type: String
    }],
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    qualification: String,
    experience: {
        type: String,
        default: '0 years'
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    salary: Number,
    address: String,
    emergencyContact: String,
    bloodGroup: String,
    bankDetails: {
        accountNumber: String,
        bankName: String,
        ifscCode: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);