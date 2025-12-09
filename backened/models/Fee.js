const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        enum: ['Tuition', 'Transport', 'Hostel', 'Exam', 'Other'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    paymentDate: Date,
    paymentMethod: String,
    transactionId: String,
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue', 'Partial'],
        default: 'Pending'
    },
    receiptNumber: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);