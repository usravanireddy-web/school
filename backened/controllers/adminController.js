const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Create new student
// @route   POST /api/admin/students
// @access  Public (No auth)
exports.createStudent = async (req, res) => {
    try {
        const {
            studentName, gender, classId, dateOfBirth,
            parentName, parentContact, rollNumber,
            bloodGroup, emergencyContact, medicalInfo
        } = req.body;

        console.log('🎓 Creating student with data:', req.body);

        // Validate required fields
        if (!studentName || !gender || !classId || !dateOfBirth || !parentName || !parentContact || !rollNumber) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['studentName', 'gender', 'classId', 'dateOfBirth', 'parentName', 'parentContact', 'rollNumber']
            });
        }

        // Generate unique student email
        const studentEmail = `${studentName.toLowerCase().replace(/\s+/g, '.')}@school.com`;

        // Check if user already exists
        const userExists = await User.findOne({ email: studentEmail });
        if (userExists) {
            return res.status(400).json({ message: 'Student already exists with similar name' });
        }

        // Create user for student
        const user = await User.create({
            name: studentName,
            email: studentEmail,
            password: 'student123', // Default password
            role: 'student',
            phone: parentContact, // Use parent contact as phone
            address: 'Address will be updated'
        });

        // Create student profile
        const student = await Student.create({
            user: user._id,
            studentId: `STU${Date.now()}`,
            parentName: parentName,
            parentContact: parentContact,
            class: classId,
            rollNumber: rollNumber,
            dateOfBirth: dateOfBirth,
            gender: gender,
            bloodGroup: bloodGroup,
            emergencyContact: emergencyContact,
            medicalInfo: medicalInfo
        });

        // Populate and return
        const populatedStudent = await Student.findById(student._id)
            .populate('user', 'name email')
            .populate('class', 'className section');

        res.status(201).json({
            message: 'Student created successfully!',
            student: {
                _id: populatedStudent._id,
                studentId: populatedStudent.studentId,
                studentName: populatedStudent.user.name,
                email: populatedStudent.user.email,
                gender: populatedStudent.gender,
                dateOfBirth: populatedStudent.dateOfBirth,
                class: populatedStudent.class,
                rollNumber: populatedStudent.rollNumber,
                parentName: populatedStudent.parentName,
                parentContact: populatedStudent.parentContact,
                bloodGroup: populatedStudent.bloodGroup,
                emergencyContact: populatedStudent.emergencyContact,
                medicalInfo: populatedStudent.medicalInfo,
                admissionDate: populatedStudent.admissionDate
            }
        });

    } catch (error) {
        console.error('❌ Student creation error:', error);
        res.status(500).json({ message: 'Student creation failed: ' + error.message });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Public
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('user', 'name email')
            .populate('class', 'className section')
            .sort({ createdAt: -1 });

        const formattedStudents = students.map(student => ({
            _id: student._id,
            studentId: student.studentId,
            studentName: student.user.name,
            email: student.user.email,
            gender: student.gender,
            dateOfBirth: student.dateOfBirth,
            class: student.class,
            rollNumber: student.rollNumber,
            parentName: student.parentName,
            parentContact: student.parentContact,
            bloodGroup: student.bloodGroup,
            admissionDate: student.admissionDate
        }));

        res.json({
            message: 'Students retrieved successfully',
            students: formattedStudents
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};