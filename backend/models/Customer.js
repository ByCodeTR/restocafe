const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // Temel Bilgiler
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },

  // İletişim Tercihleri
  contactPreferences: {
    sms: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    }
  },

  // Özel Notlar
  notes: {
    type: String,
    trim: true
  },
  dietaryRestrictions: [{
    type: String,
    trim: true
  }],
  preferences: {
    seatingPreference: {
      type: String,
      enum: ['window', 'outdoor', 'indoor', 'quiet', 'any'],
      default: 'any'
    },
    favoriteTable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table'
    }
  },

  // Sadakat Programı
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  memberSince: {
    type: Date,
    default: Date.now
  },

  // İstatistikler
  stats: {
    totalVisits: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastVisit: Date,
    averageSpendPerVisit: {
      type: Number,
      default: 0
    },
    noShowCount: {
      type: Number,
      default: 0
    },
    cancelCount: {
      type: Number,
      default: 0
    }
  },

  // Sistem Bilgileri
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Endeksler
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ 'stats.lastVisit': -1 });
customerSchema.index({ loyaltyPoints: -1 });

// Virtuals
customerSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'customer'
});

customerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customer'
});

// Metodlar
customerSchema.methods.addLoyaltyPoints = async function(points) {
  this.loyaltyPoints += points;
  
  // Üyelik seviyesi güncelleme
  if (this.loyaltyPoints >= 1000) {
    this.membershipTier = 'platinum';
  } else if (this.loyaltyPoints >= 500) {
    this.membershipTier = 'gold';
  } else if (this.loyaltyPoints >= 200) {
    this.membershipTier = 'silver';
  }

  await this.save();
};

customerSchema.methods.updateStats = async function(orderAmount) {
  const stats = this.stats;
  stats.totalVisits += 1;
  stats.totalSpent += orderAmount;
  stats.lastVisit = new Date();
  stats.averageSpendPerVisit = stats.totalSpent / stats.totalVisits;
  await this.save();
};

customerSchema.methods.recordNoShow = async function() {
  this.stats.noShowCount += 1;
  await this.save();
};

customerSchema.methods.recordCancellation = async function() {
  this.stats.cancelCount += 1;
  await this.save();
};

// Statik Metodlar
customerSchema.statics.findByContact = async function(contact) {
  return this.findOne({
    $or: [
      { phone: contact },
      { email: contact.toLowerCase() }
    ]
  });
};

customerSchema.statics.getTopCustomers = async function(limit = 10) {
  return this.find({
    status: 'active'
  })
  .sort({
    'stats.totalSpent': -1
  })
  .limit(limit);
};

// Pre-save hook
customerSchema.pre('save', async function(next) {
  if (this.isModified('stats.totalSpent') || this.isModified('stats.totalVisits')) {
    // Her 100 TL harcama için 1 puan
    const pointsToAdd = Math.floor((this.stats.totalSpent - (this._oldStats?.totalSpent || 0)) / 100);
    if (pointsToAdd > 0) {
      await this.addLoyaltyPoints(pointsToAdd);
    }
  }
  next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 