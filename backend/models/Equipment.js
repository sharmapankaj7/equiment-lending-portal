const mongoose = require('mongoose');

/**
 * Equipment Schema
 * Defines the structure for equipment items available for lending
 */
const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide equipment name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Sports Equipment', 'Lab Equipment', 'Cameras/Electronics', 'Musical Instruments', 'Project Materials', 'Other']
  },
  description: {
    type: String,
    default: ''
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 0
  },
  available: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
equipmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);
