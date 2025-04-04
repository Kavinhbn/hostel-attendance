const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Test database connection
router.get('/connection', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      status: 'success',
      connectionState: states[connectionState],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      models: mongoose.modelNames()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test model creation
router.get('/models', async (req, res) => {
  try {
    // Test Student model
    const testStudent = new (mongoose.model('Student'))({
      name: 'Test Student',
      rollNumber: 'TEST001',
      roomNumber: 'TEST-101',
      email: 'test@example.com',
      password: 'test123',
      phone: '1234567890',
      messPlan: 'all',
      annualFee: 50000
    });

    // Test Attendance model
    const testAttendance = new (mongoose.model('Attendance'))({
      student: testStudent._id,
      date: new Date(),
      mealType: 'breakfast',
      status: 'present',
      markedBy: testStudent._id
    });

    res.json({
      status: 'success',
      message: 'Models are properly defined',
      models: {
        Student: testStudent.toObject(),
        Attendance: testAttendance.toObject()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 