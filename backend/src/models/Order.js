const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  preparedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const orderSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'mobile_payment'],
  },
  specialRequests: String,
  customerCount: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

// Indexes for faster queries
orderSchema.index({ status: 1 });
orderSchema.index({ waiter: 1 });
orderSchema.index({ table: 1 });
orderSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Order', orderSchema); 