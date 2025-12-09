const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
        unique: true
    },
    subjectName: {
        type: String,
        required: true
    },
    description: String,
    credits: {
        type: Number,
        default: 1
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);