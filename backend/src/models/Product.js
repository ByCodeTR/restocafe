const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'adet'
  },
  preparationTime: {
    type: DataTypes.INTEGER, // dakika cinsinden
    defaultValue: 15
  }
});

module.exports = Product; 