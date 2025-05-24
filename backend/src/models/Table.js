const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved'),
    defaultValue: 'available'
  },
  qrCode: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = Table; 