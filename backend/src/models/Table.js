const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['empty', 'occupied', 'reserved', 'cleaning'],
    default: 'empty'
  },
  currentWaiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  section: {
    type: String,
    required: true,
    default: 'main'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrCode: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
tableSchema.index({ number: 1 });
tableSchema.index({ status: 1 });

module.exports = mongoose.model('Table', tableSchema); 