const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  }
});

module.exports = OrderItem; 