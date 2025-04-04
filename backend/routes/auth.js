const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, adminAuth } = require('../middleware/auth');
const Student = require('../models/Student');

// Student login
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Find student by roll number
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!student.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    student.lastLogin = new Date();
    await student.save();

    // Generate token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        role: student.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only student registration
router.post('/register', adminAuth, async (req, res) => {
  try {
    const { name, rollNumber, password, roomNumber, phoneNumber } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ rollNumber });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create new student
    student = new Student({
      name,
      rollNumber,
      password,
      roomNumber,
      phoneNumber,
      role: 'student',
      isActive: true
    });

    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    res.json(student);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only: Deactivate/Activate student account
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isActive = isActive;
    await student.save();

    res.json({ message: `Student account ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 