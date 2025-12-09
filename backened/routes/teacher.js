const express = require('express');
const router = express.Router();

// POST /api/teacher/attendance - MARK ATTENDANCE (NO AUTH)
router.post('/attendance', async (req, res) => {
    try {
        const { classId, date, attendanceRecords } = req.body;
        
        console.log('📝 Marking attendance for class:', classId);
        console.log('Date:', date);
        console.log('Records:', attendanceRecords);

        // Simple validation
        if (!classId || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({
                message: 'classId, date, and attendanceRecords array are required'
            });
        }

        // For now, just return success
        res.json({
            message: 'Attendance marked successfully!',
            classId: classId,
            date: date,
            totalStudents: attendanceRecords.length,
            summary: {
                present: attendanceRecords.filter(r => r.status === 'Present').length,
                absent: attendanceRecords.filter(r => r.status === 'Absent').length,
                late: attendanceRecords.filter(r => r.status === 'Late').length
            }
        });

    } catch (error) {
        console.error('Attendance error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/teacher/students/:classId - GET CLASS STUDENTS (NO AUTH)
router.get('/students/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        
        console.log('👥 Getting students for class:', classId);

        const Student = require('../models/Student');
        const Class = require('../models/Class');

        // Check if class exists
        const classInfo = await Class.findById(classId);
        if (!classInfo) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Get students in this class
        const students = await Student.find({ class: classId })
            .populate('user', 'name email')
            .populate('class', 'className section');

        const formattedStudents = students.map(student => ({
            studentId: student._id,
            studentName: student.user.name,
            email: student.user.email,
            rollNumber: student.rollNumber,
            gender: student.gender,
            parentName: student.parentName,
            parentContact: student.parentContact
        }));

        res.json({
            message: 'Students retrieved successfully',
            class: {
                classId: classInfo._id,
                className: classInfo.className,
                section: classInfo.section
            },
            totalStudents: students.length,
            students: formattedStudents
        });

    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/teacher/grades - ADD GRADES (NO AUTH)
router.post('/grades', async (req, res) => {
    try {
        const { studentId, subject, examType, marks, totalMarks, comments } = req.body;
        
        console.log('📊 Adding grade for student:', studentId);

        if (!studentId || !examType || !marks) {
            return res.status(400).json({
                message: 'studentId, examType, and marks are required'
            });
        }

        // Calculate percentage and grade
        const percentage = totalMarks ? (marks / totalMarks) * 100 : marks;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';

        res.json({
            message: 'Grade added successfully!',
            grade: {
                studentId: studentId,
                subject: subject || 'General',
                examType: examType,
                marks: marks,
                totalMarks: totalMarks || 100,
                percentage: percentage.toFixed(2),
                grade: grade,
                comments: comments
            }
        });

    } catch (error) {
        console.error('Add grade error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/teacher/assignments - CREATE ASSIGNMENT (NO AUTH)
router.post('/assignments', async (req, res) => {
    try {
        const { title, description, classId, dueDate, totalMarks } = req.body;
        
        console.log('📚 Creating assignment:', title);

        if (!title || !classId || !dueDate) {
            return res.status(400).json({
                message: 'title, classId, and dueDate are required'
            });
        }

        // For now, just return success
        res.json({
            message: 'Assignment created successfully!',
            assignment: {
                title: title,
                description: description || '',
                classId: classId,
                dueDate: dueDate,
                totalMarks: totalMarks || 10,
                createdAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/teacher/my-classes - GET TEACHER'S CLASSES (NO AUTH)
router.get('/my-classes', async (req, res) => {
    try {
        const Class = require('../models/Class');
        
        // Get all classes (for now - in real system, filter by teacher)
        const classes = await Class.find().select('_id className section capacity currentStrength');

        res.json({
            message: 'Classes retrieved successfully',
            classes: classes.map(cls => ({
                classId: cls._id,
                className: cls.className,
                section: cls.section,
                capacity: cls.capacity,
                currentStrength: cls.currentStrength
            }))
        });

    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;