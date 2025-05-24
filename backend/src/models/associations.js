const User = require('./User');
const Table = require('./Table');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Reservation = require('./Reservation');

module.exports = function defineAssociations() {
  // Table - User (Waiter) Association
  Table.belongsTo(User, {
    as: 'currentWaiter',
    foreignKey: 'currentWaiterId'
  });

  User.hasMany(Table, {
    as: 'assignedTables',
    foreignKey: 'currentWaiterId'
  });

  // Category - Category (Self) Association
  Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parentId'
  });

  Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parentId'
  });

  // Category - Product Association
  Category.hasMany(Product, {
    foreignKey: 'categoryId'
  });

  Product.belongsTo(Category, {
    foreignKey: 'categoryId'
  });

  // Product - Product (Variant) Association
  Product.belongsTo(Product, {
    as: 'parent',
    foreignKey: 'parentId'
  });

  Product.hasMany(Product, {
    as: 'variants',
    foreignKey: 'parentId'
  });

  // Order - User (Waiter) Association
  Order.belongsTo(User, {
    as: 'waiter',
    foreignKey: 'waiterId'
  });

  User.hasMany(Order, {
    as: 'orders',
    foreignKey: 'waiterId'
  });

  // Order - User (Customer) Association
  Order.belongsTo(User, {
    as: 'customer',
    foreignKey: 'customerId'
  });

  User.hasMany(Order, {
    as: 'customerOrders',
    foreignKey: 'customerId'
  });

  // Order - Table Association
  Order.belongsTo(Table, {
    foreignKey: 'tableId'
  });

  Table.hasMany(Order, {
    foreignKey: 'tableId'
  });

  // Order - OrderItem Association
  Order.hasMany(OrderItem, {
    as: 'orderItems',
    foreignKey: 'orderId'
  });

  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId'
  });

  // OrderItem - Product Association
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId'
  });

  Product.hasMany(OrderItem, {
    foreignKey: 'productId'
  });

  // Reservation - Table Association
  Reservation.belongsTo(Table, {
    foreignKey: 'tableId'
  });

  Table.hasMany(Reservation, {
    foreignKey: 'tableId'
  });

  // Reservation - User (Staff) Association
  Reservation.belongsTo(User, {
    as: 'staff',
    foreignKey: 'userId'
  });

  User.hasMany(Reservation, {
    as: 'reservations',
    foreignKey: 'userId'
  });

  // Reservation - User (Customer) Association
  Reservation.belongsTo(User, {
    as: 'customer',
    foreignKey: 'customerId'
  });

  User.hasMany(Reservation, {
    as: 'customerReservations',
    foreignKey: 'customerId'
  });
}; 