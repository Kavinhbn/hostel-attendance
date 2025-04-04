const mongoose = require('mongoose');

const entryRecordSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  entryTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['entered', 'exited'],
    default: 'entered'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EntryRecord', entryRecordSchema); 