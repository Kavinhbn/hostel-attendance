const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Leave = require('../models/Leave');
const Student = require('../models/Student');

// Apply for leave
router.post('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    
    // Validate required fields
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const leave = new Leave({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      student: req.student._id
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all leaves
router.get('/', auth, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('student', 'name rollNumber')
      .sort('-createdAt');
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student's leaves
router.get('/student', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.student._id })
      .populate('student', 'name rollNumber')
      .sort('-createdAt');
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching student leaves:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update leave status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = req.body.status;
    await leave.save();
    res.json(leave);
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 