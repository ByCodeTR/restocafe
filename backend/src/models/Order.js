const mongoose = require('mongoose');

// Sipariş ürün detayı şeması
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Miktar en az 1 olmalıdır']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  variations: [{
    name: String,
    option: {
      name: String,
      price: Number
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  preparationStartTime: Date,
  preparationEndTime: Date
});

// Ana sipariş şeması
const orderSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
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
    required: true,
    min: 0
  },
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    name: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  payments: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'mobile'],
      required: true
    },
    transactionId: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ table: 1, status: 1 });
orderSchema.index({ waiter: 1 });
orderSchema.index({ createdAt: 1 });
orderSchema.index({ 'items.product': 1 });
orderSchema.index({ 'items.status': 1 });

// Virtual for remaining amount
orderSchema.virtual('remainingAmount').get(function() {
  const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return this.totalAmount - totalPaid;
});

// Methods
orderSchema.methods.updateItemStatus = async function(itemId, status) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Sipariş kalemi bulunamadı');
  }

  item.status = status;
  
  if (status === 'preparing') {
    item.preparationStartTime = new Date();
  } else if (status === 'ready' || status === 'cancelled') {
    item.preparationEndTime = new Date();
  }

  await this.save();
  return item;
};

orderSchema.methods.addPayment = async function(paymentData) {
  if (this.status !== 'active') {
    throw new Error('Tamamlanmış veya iptal edilmiş siparişe ödeme eklenemez');
  }

  if (paymentData.amount <= 0) {
    throw new Error('Ödeme tutarı 0\'dan büyük olmalıdır');
  }

  const currentTotal = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const newTotal = currentTotal + paymentData.amount;

  if (newTotal > this.totalAmount) {
    throw new Error('Toplam ödeme tutarı sipariş tutarını aşamaz');
  }

  this.payments.push(paymentData);
  
  if (newTotal === this.totalAmount) {
    this.paymentStatus = 'completed';
    this.status = 'completed';
  } else if (newTotal > 0) {
    this.paymentStatus = 'partial';
  }

  await this.save();
  return this;
};

// Statics
orderSchema.statics.getActiveOrdersByTable = function(tableId) {
  return this.find({
    table: tableId,
    status: 'active'
  }).populate('items.product waiter');
};

orderSchema.statics.getDailyOrders = function(date = new Date()) {
  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(date.setHours(23, 59, 59, 999));
  
  return this.find({
    createdAt: {
      $gte: start,
      $lte: end
    }
  }).populate('table waiter items.product');
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 