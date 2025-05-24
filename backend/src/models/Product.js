const mongoose = require('mongoose');

// Varyasyon seçenek şeması (örn: Boyut: Küçük, Orta, Büyük)
const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Varyasyon grubu şeması (örn: Boyut, Ekstra Malzemeler)
const variationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  required: {
    type: Boolean,
    default: false
  },
  multiSelect: {
    type: Boolean,
    default: false
  },
  options: [optionSchema]
});

// Fiyat geçmişi şeması
const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  reason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori zorunludur']
  },
  basePrice: {
    type: Number,
    required: [true, 'Temel fiyat zorunludur'],
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  priceHistory: [priceHistorySchema],
  variations: [variationSchema],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Geçersiz resim URL'
    }
  }],
  stockTracking: {
    type: Boolean,
    default: false
  },
  currentStock: {
    type: Number,
    min: 0,
    default: 0
  },
  minStock: {
    type: Number,
    min: 0,
    default: 0
  },
  preparationTime: {
    type: Number,
    min: 0,
    default: 15,
    description: 'Dakika cinsinden hazırlama süresi'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  code: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'variations.name': 1 });
productSchema.index({ code: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for current price (basePrice + active variations)
productSchema.virtual('currentPrice').get(function() {
  return this.basePrice;
});

// Middleware to update price history when basePrice changes
productSchema.pre('save', async function(next) {
  if (this.isModified('basePrice')) {
    // End the current price period
    const currentPriceHistory = this.priceHistory[this.priceHistory.length - 1];
    if (currentPriceHistory && !currentPriceHistory.endDate) {
      currentPriceHistory.endDate = new Date();
    }

    // Add new price to history
    this.priceHistory.push({
      price: this.basePrice,
      startDate: new Date()
    });
  }
  next();
});

// Stock management methods
productSchema.methods.updateStock = async function(quantity, type = 'remove') {
  if (!this.stockTracking) return;

  if (type === 'remove') {
    if (this.currentStock < quantity) {
      throw new Error('Yetersiz stok');
    }
    this.currentStock -= quantity;
  } else if (type === 'add') {
    this.currentStock += quantity;
  }

  await this.save();
};

// Static method to check low stock products
productSchema.statics.getLowStockProducts = async function() {
  return this.find({
    stockTracking: true,
    currentStock: { $lte: this.minStock }
  }).populate('category', 'name');
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 