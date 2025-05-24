const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'mobile_payment'),
    allowNull: true
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tables',
      key: 'id'
    }
  },
  waiterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeCreate: async (order) => {
      // Sipariş numarası oluştur: YYYYMMDD-XXXX (X: Random 4 basamak)
      const date = new Date();
      const dateStr = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');
      
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      order.orderNumber = `${dateStr}-${randomNum}`;
    },
    beforeSave: async (order) => {
      // Toplam tutarı hesapla
      const items = await order.getOrderItems();
      let totalAmount = 0;
      
      for (const item of items) {
        totalAmount += item.quantity * item.unitPrice;
      }

      order.totalAmount = totalAmount;
      order.finalAmount = totalAmount + order.tax - order.discount;
    }
  }
});

// Instance methods
Order.prototype.addItem = async function(productId, quantity, note = null, options = null) {
  const OrderItem = sequelize.models.OrderItem;
  const Product = sequelize.models.Product;

  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Ürün bulunamadı');
  }

  if (!product.isInStock() || product.stock < quantity) {
    throw new Error('Yetersiz stok');
  }

  const item = await OrderItem.create({
    orderId: this.id,
    productId,
    quantity,
    unitPrice: product.getCurrentPrice(),
    note,
    options
  });

  // Stok güncelle
  product.stock -= quantity;
  await product.save();

  return item;
};

Order.prototype.updateItem = async function(itemId, quantity, note = null) {
  const OrderItem = sequelize.models.OrderItem;
  const Product = sequelize.models.Product;

  const item = await OrderItem.findOne({
    where: { id: itemId, orderId: this.id }
  });

  if (!item) {
    throw new Error('Sipariş kalemi bulunamadı');
  }

  const product = await Product.findByPk(item.productId);
  if (!product) {
    throw new Error('Ürün bulunamadı');
  }

  // Stok kontrolü
  const stockDiff = quantity - item.quantity;
  if (stockDiff > 0 && (!product.isInStock() || product.stock < stockDiff)) {
    throw new Error('Yetersiz stok');
  }

  // Stok güncelle
  product.stock -= stockDiff;
  await product.save();

  // Sipariş kalemini güncelle
  await item.update({
    quantity,
    note: note !== null ? note : item.note
  });

  return item;
};

Order.prototype.removeItem = async function(itemId) {
  const OrderItem = sequelize.models.OrderItem;
  const Product = sequelize.models.Product;

  const item = await OrderItem.findOne({
    where: { id: itemId, orderId: this.id }
  });

  if (!item) {
    throw new Error('Sipariş kalemi bulunamadı');
  }

  // Stok iade
  const product = await Product.findByPk(item.productId);
  if (product) {
    product.stock += item.quantity;
    await product.save();
  }

  await item.destroy();
};

Order.prototype.updateStatus = async function(newStatus) {
  const validStatuses = ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Geçersiz sipariş durumu');
  }

  // Sipariş iptal ediliyorsa stokları iade et
  if (newStatus === 'cancelled' && this.status !== 'cancelled') {
    const items = await this.getOrderItems();
    const Product = sequelize.models.Product;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  this.status = newStatus;
  await this.save();
};

Order.prototype.addPayment = async function(amount, method) {
  const validMethods = ['cash', 'credit_card', 'debit_card', 'mobile_payment'];
  if (!validMethods.includes(method)) {
    throw new Error('Geçersiz ödeme yöntemi');
  }

  if (amount <= 0) {
    throw new Error('Geçersiz ödeme tutarı');
  }

  const remainingAmount = this.finalAmount - this.paidAmount;
  if (amount > remainingAmount) {
    throw new Error('Ödeme tutarı kalan tutardan büyük olamaz');
  }

  this.paidAmount += amount;
  this.paymentMethod = method;

  if (this.paidAmount >= this.finalAmount) {
    this.paymentStatus = 'paid';
  } else if (this.paidAmount > 0) {
    this.paymentStatus = 'partially_paid';
  }

  await this.save();
};

module.exports = Order; 