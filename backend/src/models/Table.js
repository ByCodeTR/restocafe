const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Masa numarası zorunludur'],
    unique: true,
    min: [1, 'Masa numarası 1\'den küçük olamaz']
  },
  capacity: {
    type: Number,
    required: [true, 'Masa kapasitesi zorunludur'],
    min: [1, 'Masa kapasitesi 1\'den küçük olamaz']
  },
  section: {
    type: String,
    required: [true, 'Masa bölümü zorunludur'],
    trim: true
  },
  status: {
    type: String,
    enum: ['empty', 'occupied', 'reserved', 'cleaning'],
    default: 'empty'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrCode: {
    type: String,
    required: true
  },
  currentWaiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
tableSchema.index({ number: 1 });
tableSchema.index({ section: 1 });
tableSchema.index({ status: 1 });

// Virtual for table identifier (e.g., "A-12" for section A, table 12)
tableSchema.virtual('identifier').get(function() {
  return `${this.section}-${this.number}`;
});

// Middleware to prevent deletion of non-empty tables
tableSchema.pre('remove', async function(next) {
  if (this.status !== 'empty') {
    const err = new Error('Dolu veya rezerve masa silinemez');
    next(err);
  }
  next();
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table; 