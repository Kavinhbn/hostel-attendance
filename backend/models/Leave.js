const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    mealsAffected: [{
        date: Date,
        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner']
        }
    }]
}, {
    timestamps: true
});

// Index for efficient querying
leaveSchema.index({ student: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Leave', leaveSchema); 