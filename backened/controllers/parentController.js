const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Fee = require('../models/Fee');

// @desc    Get parent's children
// @route   GET /api/parent/children
// @access  Private/Parent
exports.getChildren = async (req, res) => {
    try {
        const parent = await Parent.findOne({ user: req.user.id })
            .populate({
                path: 'students',
                populate: [
                    { path: 'user', model: 'User' },
                    { path: 'class', model: 'Class' }
                ]
            });
        
        res.json(parent.students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get child's attendance
// @route   GET /api/parent/attendance/:studentId
// @access  Private/Parent
exports.getChildAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Verify the student belongs to the parent
        const parent = await Parent.findOne({ user: req.user.id });
        if (!parent.students.includes(studentId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const attendance = await Attendance.find({ student: studentId })
            .populate('class')
            .sort({ date: -1 })
            .limit(30); // Last 30 days

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get child's grades
// @route   GET /api/parent/grades/:studentId
// @access  Private/Parent
exports.getChildGrades = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const parent = await Parent.findOne({ user: req.user.id });
        if (!parent.students.includes(studentId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const grades = await Grade.find({ student: studentId })
            .populate('subject')
            .populate('class')
            .sort({ createdAt: -1 });
        
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get child's fee details
// @route   GET /api/parent/fees/:studentId
// @access  Private/Parent
exports.getChildFees = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const parent = await Parent.findOne({ user: req.user.id });
        if (!parent.students.includes(studentId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const fees = await Fee.find({ student: studentId })
            .populate('class')
            .sort({ dueDate: 1 });
        
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};