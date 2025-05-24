const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // Müşteri Bilgileri
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },

  // Rezervasyon Detayları
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },

  // Sistem Bilgileri
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Endeksler
reservationSchema.index({ time: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ table: 1, time: 1 });
reservationSchema.index({ customerPhone: 1 });
reservationSchema.index({ customerEmail: 1 });

// Virtuals
reservationSchema.virtual('isToday').get(function() {
  const today = new Date();
  const reservationDate = new Date(this.time);
  return (
    today.getDate() === reservationDate.getDate() &&
    today.getMonth() === reservationDate.getMonth() &&
    today.getFullYear() === reservationDate.getFullYear()
  );
});

// Metodlar
reservationSchema.methods.cancel = async function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancelReason = reason;
  this.updatedBy = userId;
  await this.save();
};

reservationSchema.methods.confirm = async function(userId) {
  this.status = 'confirmed';
  this.updatedBy = userId;
  await this.save();
};

// Statik Metodlar
reservationSchema.statics.findConflicts = async function(tableId, time, duration = 2) {
  const startTime = new Date(time);
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  return this.find({
    table: tableId,
    status: { $ne: 'cancelled' },
    time: {
      $gte: startTime,
      $lt: endTime
    }
  });
};

reservationSchema.statics.findByDateRange = async function(startDate, endDate) {
  return this.find({
    time: {
      $gte: startDate,
      $lt: endDate
    }
  }).populate('table');
};

// Pre-save hook
reservationSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('time') || this.isModified('table')) {
    const conflicts = await this.constructor.findConflicts(
      this.table,
      this.time
    );

    if (conflicts.length > 0 && conflicts[0]._id !== this._id) {
      const error = new Error('Bu masa için seçilen saatte başka bir rezervasyon bulunmaktadır.');
      error.name = 'ValidationError';
      next(error);
    }
  }
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation; 