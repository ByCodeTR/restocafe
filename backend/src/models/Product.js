const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'side']
  },
  price: {
    type: Number,
    required: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  stock: {
    current: {
      type: Number,
      required: true,
      default: 0
    },
    minimum: {
      type: Number,
      required: true,
      default: 10
    },
    unit: {
      type: String,
      required: true,
      default: 'piece'
    }
  },
  image: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String
  }],
  ingredients: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    },
    quantity: Number
  }]
}, {
  timestamps: true
});

// Middleware to check stock before saving
productSchema.pre('save', function(next) {
  if (this.stock.current <= this.stock.minimum) {
    // You could emit an event here for low stock notification
    console.log(`Low stock alert for ${this.name}`);
  }
  next();
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ 'stock.current': 1 });
productSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Product', productSchema); 