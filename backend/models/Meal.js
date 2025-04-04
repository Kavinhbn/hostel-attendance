const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'],
        required: true
    },
    menu: {
        type: String,
        required: true,
        trim: true
    },
    expectedAttendance: {
        type: Number,
        required: true,
        min: 0
    },
    actualAttendance: {
        type: Number,
        default: 0
    },
    preparedQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    wastage: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed'],
        default: 'planned'
    }
}, {
    timestamps: true
});

// Compound index for date and meal type
mealSchema.index({ date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('Meal', mealSchema); 