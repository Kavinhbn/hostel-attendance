const mongoose = require('mongoose');

const exitRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  exitTime: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // in minutes
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExitRecord', exitRecordSchema); 