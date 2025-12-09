const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Fee = require('../models/Fee');
const Announcement = require('../models/Announcement');
const moment = require('moment');

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
    try {
        const [
            totalStudents,
            totalTeachers,
            totalParents,
            totalClasses,
            recentStudents,
            recentTeachers,
            announcements
        ] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Parent.countDocuments(),
            Class.countDocuments(),
            Student.find()
                .populate('user', 'name email profilePicture')
                .populate('class', 'className section')
                .sort({ createdAt: -1 })
                .limit(5),
            Teacher.find()
                .populate('user', 'name email profilePicture')
                .sort({ createdAt: -1 })
                .limit(5),
            Announcement.find({ isActive: true })
                .populate('author', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        // Get attendance statistics for current month
        const currentMonthStart = moment().startOf('month').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();
        
        const monthlyAttendance = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: currentMonthStart, $lte: currentMonthEnd }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get class-wise student count
        const classStats = await Class.aggregate([
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: 'class',
                    as: 'students'
                }
            },
            {
                $project: {
                    className: 1,
                    section: 1,
                    studentCount: { $size: '$students' },
                    capacity: 1
                }
            }
        ]);

        res.json({
            overview: {
                totalStudents,
                totalTeachers,
                totalParents,
                totalClasses
            },
            recent: {
                students: recentStudents,
                teachers: recentTeachers
            },
            attendance: monthlyAttendance,
            classStats,
            announcements
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get teacher dashboard data
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
exports.getTeacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user.id;
        
        const teacher = await Teacher.findOne({ user: teacherId })
            .populate('classes')
            .populate('subjects');

        const totalClasses = teacher.classes.length;
        const totalSubjects = teacher.subjects.length;

        // Get today's schedule
        const today = moment().format('dddd');
        const todaysClasses = await Class.find({
            'schedule.day': today,
            'schedule.periods.teacher': teacherId
        }).populate('schedule.periods.subject');

        // Get pending assignments to grade
        const pendingAssignments = await Assignment.find({
            teacher: teacherId,
            'submissions.marks': { $exists: false }
        })
        .populate('subject')
        .populate('class')
        .limit(5);

        // Get recent announcements
        const announcements = await Announcement.find({
            $or: [
                { targetAudience: 'all' },
                { targetAudience: 'teachers' }
            ],
            isActive: true
        })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

        res.json({
            overview: {
                totalClasses,
                totalSubjects,
                pendingAssignments: pendingAssignments.length
            },
            todaysClasses,
            pendingAssignments,
            announcements,
            profile: {
                classes: teacher.classes,
                subjects: teacher.subjects
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
// @access  Private/Student
exports.getStudentDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id })
            .populate('class')
            .populate('parent');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get attendance summary
        const attendanceSummary = await Attendance.aggregate([
            {
                $match: { student: student._id }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent grades
        const recentGrades = await Grade.find({ student: student._id })
            .populate('subject')
            .populate('class')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get upcoming assignments
        const upcomingAssignments = await Assignment.find({
            class: student.class,
            dueDate: { $gte: new Date() }
        })
        .populate('subject')
        .populate('teacher', 'name')
        .sort({ dueDate: 1 })
        .limit(5);

        // Get today's schedule
        const today = moment().format('dddd');
        const classSchedule = await Class.findById(student.class)
            .populate('schedule.periods.subject')
            .populate('schedule.periods.teacher', 'name');

        const todaysSchedule = classSchedule?.schedule?.find(s => s.day === today) || { periods: [] };

        // Get announcements
        const announcements = await Announcement.find({
            $or: [
                { targetAudience: 'all' },
                { targetAudience: 'students' }
            ],
            isActive: true
        })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

        res.json({
            profile: {
                student: student,
                class: student.class
            },
            attendance: attendanceSummary,
            recentGrades,
            upcomingAssignments,
            todaysSchedule: todaysSchedule.periods,
            announcements
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get parent dashboard data
// @route   GET /api/dashboard/parent
// @access  Private/Parent
exports.getParentDashboard = async (req, res) => {
    try {
        const parent = await Parent.findOne({ user: req.user.id })
            .populate({
                path: 'students',
                populate: [
                    { path: 'user', select: 'name email profilePicture' },
                    { path: 'class', select: 'className section' }
                ]
            });

        if (!parent || parent.students.length === 0) {
            return res.json({
                children: [],
                overview: {},
                recentActivities: [],
                announcements: []
            });
        }

        const studentIds = parent.students.map(student => student._id);

        // Get attendance summary for all children
        const attendanceSummary = await Attendance.aggregate([
            {
                $match: { student: { $in: studentIds } }
            },
            {
                $group: {
                    _id: { student: '$student', status: '$status' },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.student',
                    attendance: {
                        $push: {
                            status: '$_id.status',
                            count: '$count'
                        }
                    },
                    total: { $sum: '$count' }
                }
            }
        ]);

        // Get recent grades for all children
        const recentGrades = await Grade.find({ student: { $in: studentIds } })
            .populate('student')
            .populate('subject')
            .populate('class')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get upcoming assignments
        const studentClasses = parent.students.map(student => student.class);
        const upcomingAssignments = await Assignment.find({
            class: { $in: studentClasses },
            dueDate: { $gte: new Date() }
        })
        .populate('subject')
        .populate('class')
        .populate('teacher', 'name')
        .sort({ dueDate: 1 })
        .limit(5);

        // Get fee status
        const pendingFees = await Fee.find({
            student: { $in: studentIds },
            status: { $in: ['Pending', 'Overdue', 'Partial'] }
        })
        .populate('student')
        .populate('class')
        .sort({ dueDate: 1 });

        // Get announcements
        const announcements = await Announcement.find({
            $or: [
                { targetAudience: 'all' },
                { targetAudience: 'parents' }
            ],
            isActive: true
        })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

        res.json({
            children: parent.students,
            overview: {
                totalChildren: parent.students.length,
                pendingFees: pendingFees.length,
                upcomingAssignments: upcomingAssignments.length
            },
            attendanceSummary,
            recentGrades,
            upcomingAssignments,
            pendingFees,
            announcements
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics data for admin
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query; // day, week, month, year
        
        let startDate, endDate;
        const now = moment();

        switch (period) {
            case 'day':
                startDate = now.startOf('day').toDate();
                endDate = now.endOf('day').toDate();
                break;
            case 'week':
                startDate = now.startOf('week').toDate();
                endDate = now.endOf('week').toDate();
                break;
            case 'month':
                startDate = now.startOf('month').toDate();
                endDate = now.endOf('month').toDate();
                break;
            case 'year':
                startDate = now.startOf('year').toDate();
                endDate = now.endOf('year').toDate();
                break;
            default:
                startDate = now.startOf('month').toDate();
                endDate = now.endOf('month').toDate();
        }

        // Student registration trend
        const registrationTrend = await Student.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Attendance analytics
        const attendanceAnalytics = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Class-wise performance
        const classPerformance = await Grade.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class',
                    foreignField: '_id',
                    as: 'classInfo'
                }
            },
            {
                $unwind: '$classInfo'
            },
            {
                $group: {
                    _id: '$classInfo.className',
                    averageMarks: { $avg: '$marks' },
                    totalStudents: { $addToSet: '$student' },
                    totalExams: { $sum: 1 }
                }
            },
            {
                $project: {
                    className: '$_id',
                    averageMarks: { $round: ['$averageMarks', 2] },
                    totalStudents: { $size: '$totalStudents' },
                    totalExams: 1
                }
            }
        ]);

        // Fee collection analytics
        const feeAnalytics = await Fee.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    totalAmount: { $sum: '$amount' },
                    collectedAmount: { $sum: '$paidAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            period,
            dateRange: { startDate, endDate },
            registrationTrend,
            attendanceAnalytics,
            classPerformance,
            feeAnalytics
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};