const User = require('./User');
const Table = require('./Table');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Reservation = require('./Reservation');

// İlişkileri tanımla
Table.hasMany(Order);
Order.belongsTo(Table);

User.hasMany(Order);
Order.belongsTo(User, { as: 'waiter' });

Category.hasMany(Product);
Product.belongsTo(Category);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

Table.hasMany(Reservation);
Reservation.belongsTo(Table);

User.hasMany(Reservation);
Reservation.belongsTo(User, { as: 'customer' });

module.exports = {
  User,
  Table,
  Category,
  Product,
  Order,
  OrderItem,
  Reservation
}; 