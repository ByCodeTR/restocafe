const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Rapor Tanımlama
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'sales',
      'products',
      'categories',
      'waiters',
      'customers',
      'reservations',
      'inventory',
      'financial'
    ]
  },
  description: {
    type: String,
    trim: true
  },

  // Rapor Yapılandırması
  config: {
    // Zaman Aralığı
    timeRange: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'daily'
    },
    customRange: {
      start: Date,
      end: Date
    },
    
    // Filtreleme
    filters: [{
      field: String,
      operator: {
        type: String,
        enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex']
      },
      value: mongoose.Schema.Types.Mixed
    }],

    // Gruplama
    groupBy: [{
      type: String
    }],

    // Sıralama
    sortBy: {
      field: String,
      order: {
        type: String,
        enum: ['asc', 'desc'],
        default: 'desc'
      }
    },

    // Limit
    limit: {
      type: Number,
      default: 100
    }
  },

  // Rapor Verisi (Önbellek)
  cache: {
    data: mongoose.Schema.Types.Mixed,
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  },

  // Planlama
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly']
    },
    lastRun: Date,
    nextRun: Date,
    recipients: [{
      type: String,
      trim: true
    }]
  },

  // Görselleştirme
  visualization: {
    type: {
      type: String,
      enum: ['table', 'line', 'bar', 'pie', 'scatter', 'heatmap'],
      default: 'table'
    },
    options: mongoose.Schema.Types.Mixed
  },

  // Erişim Kontrolü
  access: {
    roles: [{
      type: String,
      enum: ['admin', 'manager', 'waiter', 'kitchen']
    }],
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

  // Sistem Bilgileri
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
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
  },
  error: {
    message: String,
    stack: String,
    occurredAt: Date
  }
}, {
  timestamps: true
});

// Endeksler
reportSchema.index({ type: 1, 'config.timeRange': 1 });
reportSchema.index({ 'cache.lastUpdated': 1 });
reportSchema.index({ 'schedule.nextRun': 1 });
reportSchema.index({ status: 1 });

// Virtuals
reportSchema.virtual('isExpired').get(function() {
  return this.cache.expiresAt && this.cache.expiresAt < new Date();
});

// Metodlar
reportSchema.methods.updateCache = async function(data) {
  this.cache = {
    data,
    lastUpdated: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat geçerli
  };
  await this.save();
};

reportSchema.methods.updateSchedule = async function(schedule) {
  this.schedule = {
    ...this.schedule,
    ...schedule
  };

  // Bir sonraki çalışma zamanını hesapla
  if (schedule.enabled && schedule.frequency) {
    this.schedule.nextRun = calculateNextRun(schedule.frequency);
  }

  await this.save();
};

reportSchema.methods.recordError = async function(error) {
  this.status = 'error';
  this.error = {
    message: error.message,
    stack: error.stack,
    occurredAt: new Date()
  };
  await this.save();
};

// Statik Metodlar
reportSchema.statics.findDueReports = async function() {
  return this.find({
    'schedule.enabled': true,
    'schedule.nextRun': { $lte: new Date() }
  });
};

reportSchema.statics.findByTypeAndRange = async function(type, timeRange) {
  return this.findOne({
    type,
    'config.timeRange': timeRange,
    status: 'active'
  });
};

// Yardımcı Fonksiyonlar
function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'hourly':
      return new Date(now.setHours(now.getHours() + 1));
    case 'daily':
      return new Date(now.setDate(now.getDate() + 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return null;
  }
}

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 