const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Categories',
      key: 'id'
    },
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Category; 