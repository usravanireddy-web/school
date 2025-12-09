const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Mark attendance for students
// @route   POST /api/teacher/attendance
// @access  Private/Teacher
exports.markAttendance = async (req, res) => {
    try {
        const { classId, date, attendanceRecords } = req.body;
        const teacherId = req.user.id;

        const attendancePromises = attendanceRecords.map(async (record) => {
            return await Attendance.findOneAndUpdate(
                {
                    student: record.studentId,
                    date: new Date(date)
                },
                {
                    student: record.studentId,
                    class: classId,
                    date: new Date(date),
                    status: record.status,
                    remarks: record.remarks,
                    markedBy: teacherId
                },
                { upsert: true, new: true }
            );
        });

        const results = await Promise.all(attendancePromises);
        res.json({ message: 'Attendance marked successfully', results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get students by class
// @route   GET /api/teacher/students/:classId
// @access  Private/Teacher
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const students = await Student.find({ class: classId })
            .populate('user')
            .populate('class');
        
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add grades for students
// @route   POST /api/teacher/grades
// @access  Private/Teacher
exports.addGrade = async (req, res) => {
    try {
        const { studentId, subjectId, classId, examType, marks, totalMarks, comments } = req.body;
        const teacherId = req.user.id;

        // Calculate grade based on marks
        const percentage = (marks / totalMarks) * 100;
        let grade = '';
        
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'F';

        const gradeRecord = await Grade.create({
            student: studentId,
            subject: subjectId,
            class: classId,
            examType,
            marks,
            totalMarks,
            grade,
            comments,
            recordedBy: teacherId
        });

        const populatedGrade = await Grade.findById(gradeRecord._id)
            .populate('student')
            .populate('subject')
            .populate('class');

        res.status(201).json(populatedGrade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create assignment
// @route   POST /api/teacher/assignments
// @access  Private/Teacher
exports.createAssignment = async (req, res) => {
    try {
        const {
            title, description, subjectId, classId, dueDate, totalMarks, attachments
        } = req.body;
        const teacherId = req.user.id;

        const assignment = await Assignment.create({
            title,
            description,
            subject: subjectId,
            class: classId,
            teacher: teacherId,
            dueDate,
            totalMarks,
            attachments
        });

        const populatedAssignment = await Assignment.findById(assignment._id)
            .populate('subject')
            .populate('class')
            .populate('teacher');

        res.status(201).json(populatedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get teacher's classes and subjects
// @route   GET /api/teacher/my-classes
// @access  Private/Teacher
exports.getMyClasses = async (req, res) => {
    try {
        const teacherId = req.user.id;
        
        const classes = await Class.find({ 
            $or: [
                { classTeacher: teacherId },
                { 'schedule.periods.teacher': teacherId }
            ]
        }).populate('classTeacher');

        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};