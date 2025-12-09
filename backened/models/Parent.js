const mongoose = require('mongoose');

const studentSubSchema = new mongoose.Schema({
    studentId: String,
    studentName: String,
    studentUserId: mongoose.Schema.Types.ObjectId,
    studentProfileId: mongoose.Schema.Types.ObjectId,
    class: {
        classId: mongoose.Schema.Types.ObjectId,
        className: String,
        section: String
    },
    rollNumber: String,
    gender: String,
    dateOfBirth: Date,
    admissionDate: Date
});

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
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    occupation: String,
    relationship: String,
    address: String,
    emergencyContact: String,
    
    // ✅ This stores EMBEDDED documents, not ObjectId references
    students: [studentSubSchema],
    
    totalStudents: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Parent', parentSchema);