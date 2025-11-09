const mongoose = require('mongoose');

/**
 * BorrowRequest Schema
 * Manages equipment borrowing requests and their lifecycle
 */
const borrowRequestSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: 1
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'OVERDUE'],
    default: 'PENDING'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  borrowDate: {
    type: Date
  },
  expectedReturnDate: {
    type: Date,
    required: [true, 'Please provide expected return date']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  actualReturnDate: {
    type: Date
  },
  purpose: {
    type: String,
    required: [true, 'Please provide purpose for borrowing']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for querying overdue items efficiently
borrowRequestSchema.index({ status: 1, dueDate: 1 });
borrowRequestSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
