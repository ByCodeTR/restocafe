const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served', 'cancelled'),
    defaultValue: 'pending'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Ürün varyant seçenekleri (örn: {"size": "large", "extras": ["cheese", "mushroom"]})'
  }
});

// Instance methods
OrderItem.prototype.updateStatus = async function(newStatus) {
  const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Geçersiz sipariş kalemi durumu');
  }

  // Sipariş kalemi iptal ediliyorsa stok iade et
  if (newStatus === 'cancelled' && this.status !== 'cancelled') {
    const Product = sequelize.models.Product;
    const product = await Product.findByPk(this.productId);
    if (product) {
      product.stock += this.quantity;
      await product.save();
    }
  }

  this.status = newStatus;
  await this.save();
};

OrderItem.prototype.getSubtotal = function() {
  return this.quantity * this.unitPrice;
};

module.exports = OrderItem; 