const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');

// @desc    Get student attendance
// @route   GET /api/student/attendance
// @access  Private/Student
exports.getAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        
        const attendance = await Attendance.find({ student: student._id })
            .populate('class')
            .sort({ date: -1 });
        
        // Calculate attendance summary
        const totalDays = attendance.length;
        const presentDays = attendance.filter(a => a.status === 'Present').length;
        const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        res.json({
            attendance,
            summary: {
                totalDays,
                presentDays,
                absentDays: totalDays - presentDays,
                attendancePercentage: attendancePercentage.toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student grades
// @route   GET /api/student/grades
// @access  Private/Student
exports.getGrades = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        
        const grades = await Grade.find({ student: student._id })
            .populate('subject')
            .populate('class')
            .sort({ createdAt: -1 });
        
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student assignments
// @route   GET /api/student/assignments
// @access  Private/Student
exports.getAssignments = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        
        const assignments = await Assignment.find({ class: student.class })
            .populate('subject')
            .populate('teacher')
            .sort({ dueDate: 1 });
        
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit assignment
// @route   POST /api/student/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { file } = req.body;
        const student = await Student.findOne({ user: req.user.id });

        const assignment = await Assignment.findById(id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if already submitted
        const existingSubmission = assignment.submissions.find(
            sub => sub.student.toString() === student._id.toString()
        );

        if (existingSubmission) {
            return res.status(400).json({ message: 'Assignment already submitted' });
        }

        assignment.submissions.push({
            student: student._id,
            file
        });

        await assignment.save();

        res.json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};