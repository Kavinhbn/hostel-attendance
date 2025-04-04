const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Get financial summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    // Get all students
    const students = await Student.find();
    
    const mealCost = parseInt(process.env.MEAL_COST) || 50;
    
    const monthlySavings = students.reduce((total, student) => {
      return total + (student.mealsMissed * mealCost); 
    }, 0);

    // Calculate annual savings
    const annualSavings = monthlySavings * 12;

    // Calculate average meal cost
    const totalMeals = await Attendance.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      status: 'present'
    });
    const averageMealCost = totalMeals > 0 ? mealCost : 0; 

    // Get student-wise savings
    const studentSavings = students.map(student => ({
      name: student.name,
      rollNumber: student.rollNumber,
      mealsMissed: student.mealsMissed,
      savings: student.savings,
      refundDue: student.savings * mealCost 
    }));

    res.json({
      monthlySavings,
      annualSavings,
      averageMealCost,
      studentSavings
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 