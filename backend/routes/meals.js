const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Get meal forecast
router.get('/forecast', auth, async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total number of students
    const totalStudents = await Student.countDocuments();

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    });

    // Get tomorrow's forecast (based on historical data)
    const tomorrowForecast = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(today.setDate(today.getDate() - 7)),
            $lt: new Date()
          }
        }
      },
      {
        $group: {
          _id: '$mealType',
          average: { $avg: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      }
    ]);

    // Calculate weekly trend
    const weeklyTrend = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(today.setDate(today.getDate() - 7)),
            $lt: new Date()
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            mealType: '$mealType'
          },
          count: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({
      totalStudents,
      today: {
        breakfast: todayAttendance.filter(a => a.mealType === 'breakfast').length,
        lunch: todayAttendance.filter(a => a.mealType === 'lunch').length,
        dinner: todayAttendance.filter(a => a.mealType === 'dinner').length
      },
      tomorrow: {
        breakfast: Math.round(tomorrowForecast.find(f => f._id === 'breakfast')?.average * totalStudents || 0),
        lunch: Math.round(tomorrowForecast.find(f => f._id === 'lunch')?.average * totalStudents || 0),
        dinner: Math.round(tomorrowForecast.find(f => f._id === 'dinner')?.average * totalStudents || 0)
      },
      weeklyTrend
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 