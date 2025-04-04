const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new student (admin only)
router.post('/register', adminAuth, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        
        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            student: {
                _id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email,
                role: student.role
            },
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email or roll number already exists'
            });
        }
        res.status(400).json({ message: error.message });
    }
});

// Login student
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }

        const student = await Student.findOne({ email }).select('+password');
        
        if (!student || !(await student.comparePassword(password))) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            student: {
                _id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email,
                role: student.role
            },
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get student profile
router.get('/profile', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.student._id)
            .select('-password -__v');
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update student profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phone', 'roomNumber'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
        updates.forEach(update => req.student[update] = req.body[update]);
        await req.student.save();
        
        const student = await Student.findById(req.student._id)
            .select('-password -__v');
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all students (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const students = await Student.find()
            .select('-password -__v')
            .sort('name');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get student by ID (admin only)
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select('-password -__v');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update student (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phone', 'roomNumber', 'messPlan', 'annualFee', 'role'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        updates.forEach(update => student[update] = req.body[update]);
        await student.save();
        
        const updatedStudent = await Student.findById(student._id)
            .select('-password -__v');
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete student (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 