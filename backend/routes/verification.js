const express = require('express');
const router = express.Router();
const EntryRecord = require('../models/EntryRecord');
const CollectionRecord = require('../models/CollectionRecord');
const ExitRecord = require('../models/ExitRecord');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Constants from environment variables
const MIN_TIME_SPENT = parseInt(process.env.MIN_TIME_SPENT) || 15;
const MEAL_TIMES = {
  breakfast: { 
    start: process.env.BREAKFAST_START || '07:00', 
    end: process.env.BREAKFAST_END || '09:00' 
  },
  lunch: { 
    start: process.env.LUNCH_START || '12:00', 
    end: process.env.LUNCH_END || '14:00' 
  },
  dinner: { 
    start: process.env.DINNER_START || '19:00', 
    end: process.env.DINNER_END || '21:00' 
  }
};

// Helper function to check if current time is within meal time
const isWithinMealTime = (mealType) => {
  const now = new Date();
  const [startHour, startMinute] = MEAL_TIMES[mealType].start.split(':');
  const [endHour, endMinute] = MEAL_TIMES[mealType].end.split(':');
  
  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0);
  
  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0);
  
  return now >= startTime && now <= endTime;
};

// Entry verification
router.post('/entry', async (req, res) => {
  try {
    const { studentId, mealType } = req.body;

    if (!isWithinMealTime(mealType)) {
      return res.status(400).json({ message: 'Outside meal time' });
    }

    const entry = new EntryRecord({
      student: studentId,
      mealType,
      entryTime: new Date()
    });

    await entry.save();
    res.json({ entry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Meal collection verification
router.post('/collection', async (req, res) => {
  try {
    const { studentId, mealType } = req.body;

    // Check if student has entered
    const entry = await EntryRecord.findOne({
      student: studentId,
      date: { 
        $gte: new Date().setHours(0,0,0,0),
        $lt: new Date().setHours(23,59,59,999)
      },
      mealType,
      status: 'entered'
    });

    if (!entry) {
      return res.status(400).json({ message: 'No entry record found' });
    }

    const collection = new CollectionRecord({
      student: studentId,
      mealType,
      collectionTime: new Date()
    });

    await collection.save();
    res.json({ collection });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Exit verification
router.post('/exit', async (req, res) => {
  try {
    const { studentId, mealType } = req.body;

    // Check if student has collected meal
    const collection = await CollectionRecord.findOne({
      student: studentId,
      date: { 
        $gte: new Date().setHours(0,0,0,0),
        $lt: new Date().setHours(23,59,59,999)
      },
      mealType,
      status: 'collected'
    });

    if (!collection) {
      return res.status(400).json({ message: 'No collection record found' });
    }

    const exitTime = new Date();
    const timeSpent = Math.round((exitTime - collection.collectionTime) / (1000 * 60));

    const exit = new ExitRecord({
      student: studentId,
      mealType,
      exitTime,
      timeSpent
    });

    await exit.save();

    // Only mark attendance if spent enough time
    if (timeSpent >= MIN_TIME_SPENT) {
      const attendance = new Attendance({
        student: studentId,
        date: new Date(),
        mealType,
        status: 'present',
        timeSpent
      });
      await attendance.save();

      // Update student's record
      await Student.findByIdAndUpdate(studentId, {
        $inc: { mealsConsumed: 1 }
      });
    }

    res.json({ exit, timeSpent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get verification status
router.get('/status/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const status = await Promise.all([
      EntryRecord.find({
        student: studentId,
        date: { $gte: today }
      }),
      CollectionRecord.find({
        student: studentId,
        date: { $gte: today }
      }),
      ExitRecord.find({
        student: studentId,
        date: { $gte: today }
      })
    ]);

    res.json({
      entries: status[0],
      collections: status[1],
      exits: status[2]
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 