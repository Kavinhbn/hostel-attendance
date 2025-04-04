const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, date, mealType, status } = req.body;
    
    // Validate required fields
    if (!studentId || !date || !mealType || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if student exists and is active
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!student.isActive) {
      return res.status(403).json({ message: 'Student account is deactivated' });
    }

    // Check if attendance already marked for this meal
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: new Date(date),
      mealType
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this meal' });
    }

    const attendance = new Attendance({
      student: studentId,
      date: new Date(date),
      mealType,
      status,
      markedBy: req.student._id
    });

    await attendance.save();

    // Update student's meals missed count if absent
    if (status === 'absent') {
      student.mealsMissed += 1;
      await student.save();
    }

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { date, mealType, status } = req.query;
    const query = {};
    
    if (date) query.date = new Date(date);
    if (mealType) query.mealType = mealType;
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber')
      .populate('markedBy', 'name')
      .sort('-date');
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student's attendance
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    // Check if student exists and is active
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!student.isActive) {
      return res.status(403).json({ message: 'Student account is deactivated' });
    }

    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('student', 'name rollNumber')
      .populate('markedBy', 'name')
      .sort('-date');
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 