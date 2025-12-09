const express = require('express');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Class = require('../models/Class');

const router = express.Router();

// POST /api/admin/students - CREATE STUDENT AND PARENT
router.post('/students', async (req, res) => {
    try {
        const {
            studentName, gender, class: className, dateOfBirth,
            parentName, parentContact, rollNumber, 
            studentEmail, studentPassword, parentEmail, parentPassword,
            relationship, occupation, bloodGroup, emergencyContact, medicalInfo
        } = req.body;

        console.log('🎓 Student and parent creation request:', req.body);

        // Validate required fields
        if (!studentName || !gender || !className || !dateOfBirth || 
            !parentName || !parentContact || !rollNumber || 
            !studentEmail || !studentPassword || !parentEmail || !parentPassword) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: [
                    'studentName', 'gender', 'class', 'dateOfBirth',
                    'parentName', 'parentContact', 'rollNumber',
                    'studentEmail', 'studentPassword', 'parentEmail', 'parentPassword'
                ]
            });
        }

        // Check if student email already exists
        const studentUserExists = await User.findOne({ email: studentEmail });
        if (studentUserExists) {
            return res.status(400).json({ message: 'Student email already exists' });
        }

        // Check if parent email already exists in User collection
        const parentUserExists = await User.findOne({ email: parentEmail });
        let parentUser;
        
        if (parentUserExists) {
            // Parent user already exists, use it
            parentUser = parentUserExists;
            console.log('✅ Using existing parent user:', parentUser.email);
        } else {
            // Create new parent user
            console.log('👨‍👩‍👧 Creating parent user...');
            parentUser = await User.create({
                name: parentName,
                email: parentEmail,
                password: parentPassword,
                role: 'parent',
                phone: parentContact,
                address: 'Address will be updated'
            });
            console.log('✅ Parent user created:', parentUser.email);
        }

        // Find or create class
        let classInfo = await Class.findOne({ className: className });
        if (!classInfo) {
            classInfo = await Class.create({
                className: className,
                section: 'A',
                capacity: 40
            });
            console.log('✅ Created new class:', className);
        }

        // ✅ CREATE OR UPDATE PARENT PROFILE
        console.log('👨‍👩‍👧 Creating/Updating parent profile...');
        
        let parent = await Parent.findOne({ email: parentEmail });
        if (!parent) {
            // Check for parent with null email
            parent = await Parent.findOne({ email: null });
        }

        if (parent) {
            // Update existing parent
            parent = await Parent.findByIdAndUpdate(
                parent._id,
                {
                    user: parentUser._id,
                    occupation: occupation || '',
                    relationship: relationship || 'Guardian',
                    email: parentEmail,
                    phone: parentContact,
                    address: 'Address will be updated',
                    $setOnInsert: { parentId: `PAR${Date.now()}` }
                },
                { new: true, upsert: false }
            );
            console.log('✅ Updated existing parent profile:', parent.parentId);
        } else {
            // Create new parent
            parent = await Parent.create({
                user: parentUser._id,
                parentId: `PAR${Date.now()}`,
                occupation: occupation || '',
                relationship: relationship || 'Guardian',
                email: parentEmail,
                phone: parentContact,
                address: 'Address will be updated'
            });
            console.log('✅ Parent profile created:', parent.parentId);
        }

        // ✅ CREATE STUDENT USER
        console.log('👤 Creating student user...');
        const studentUser = await User.create({
            name: studentName,
            email: studentEmail,
            password: studentPassword,
            role: 'student',
            phone: parentContact,
            address: 'School Address'
        });
        console.log('✅ Student user created:', studentUser.email);

        // ✅ CREATE STUDENT PROFILE (Linked to Parent)
        console.log('🎓 Creating student profile...');
        const student = await Student.create({
            user: studentUser._id,
            studentId: `STU${Date.now()}`,
            parent: parent._id,
            class: classInfo._id,
            rollNumber: rollNumber,
            dateOfBirth: dateOfBirth,
            gender: gender,
            bloodGroup: bloodGroup,
            emergencyContact: emergencyContact,
            medicalInfo: medicalInfo
        });
        console.log('✅ Student profile created:', student.studentId);

        // ✅ ADD STUDENT TO PARENT'S STUDENTS LIST
        await Parent.findByIdAndUpdate(parent._id, {
            $push: { students: student._id }
        });

        // Update class strength
        await Class.findByIdAndUpdate(classInfo._id, {
            $inc: { currentStrength: 1 }
        });

        res.status(201).json({
            message: 'Student and Parent created successfully!',
            student: {
                studentId: student.studentId,
                studentName: studentName,
                email: studentEmail,
                gender: gender,
                dateOfBirth: dateOfBirth,
                class: {
                    classId: classInfo._id,
                    className: className,
                    section: classInfo.section
                },
                rollNumber: rollNumber
            },
            parent: {
                parentId: parent.parentId,
                parentName: parentName,
                email: parentEmail,
                phone: parentContact,
                relationship: parent.relationship,
                occupation: parent.occupation
            }
        });

    } catch (error) {
        console.error('❌ Student creation error:', error);
        res.status(500).json({ 
            message: 'Student creation failed: ' + error.message,
            errorCode: error.code
        });
    }
});

// ... keep other routes the same ...