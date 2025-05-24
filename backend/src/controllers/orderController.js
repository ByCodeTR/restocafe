const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Table = require('../models/Table');
const User = require('../models/User');
const Product = require('../models/Product');
const { ValidationError, Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const socketService = require('../services/socketService');
const orderService = require('../services/orderService');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = async (req, res) => {
  const {
    status,
    tableId,
    waiterId,
    customerId,
    startDate,
    endDate,
    paymentStatus,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  // Filtreleme koşulları
  const where = {};
  
  if (status) where.status = status;
  if (tableId) where.tableId = tableId;
  if (waiterId) where.waiterId = waiterId;
  if (customerId) where.customerId = customerId;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  // Sayfalama
  const offset = (page - 1) * limit;
  
  // Sıralama
  const order = [[sortBy, sortOrder]];

  const { count, rows: orders } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'waiter',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Table,
        attributes: ['id', 'number']
      },
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          attributes: ['id', 'name']
        }]
      }
    ],
    order,
    offset,
    limit: parseInt(limit)
  });

  res.json({
    orders,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    totalItems: count
  });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'waiter',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Table,
        attributes: ['id', 'number']
      },
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'image']
        }]
      }
    ]
  });

  if (!order) {
    throw new ApiError(404, 'Sipariş bulunamadı');
  }

  res.json(order);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Waiter only)
exports.createOrder = async (req, res) => {
  try {
    const { tableId, customerId, items, note } = req.body;

    // Masa kontrolü
    const table = await Table.findByPk(tableId);
    if (!table) {
      throw new ApiError(400, 'Masa bulunamadı');
    }

    // Müşteri kontrolü
    if (customerId) {
      const customer = await User.findByPk(customerId);
      if (!customer) {
        throw new ApiError(400, 'Müşteri bulunamadı');
      }
    }

    // Sipariş oluştur
    const order = await Order.create({
      tableId,
      waiterId: req.user.id,
      customerId,
      note
    });

    // Sipariş kalemleri ekle
    if (items && items.length > 0) {
      for (const item of items) {
        await order.addItem(
          item.productId,
          item.quantity,
          item.note,
          item.options
        );
      }
    }

    // Masa durumunu güncelle
    await table.updateStatus('occupied');

    // İlişkili verileri içeren siparişi döndür
    const orderWithRelations = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name']
        },
        {
          model: Table,
          attributes: ['id', 'number']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price', 'image']
          }]
        }
      ]
    });

    // Gerçek zamanlı bildirim gönder
    socketService.notifyNewOrder(orderWithRelations);

    res.status(201).json(orderWithRelations);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz sipariş bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Waiter only)
exports.updateOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Sipariş bulunamadı');
  }

  // Sadece bekleyen siparişler güncellenebilir
  if (order.status !== 'pending') {
    throw new ApiError(400, 'Sadece bekleyen siparişler güncellenebilir');
  }

  try {
    const { note, items } = req.body;

    // Sipariş notunu güncelle
    if (note !== undefined) {
      order.note = note;
      await order.save();
    }

    // Sipariş kalemlerini güncelle
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.id) {
          // Mevcut kalem güncelleme
          if (item.quantity === 0) {
            await order.removeItem(item.id);
          } else {
            await order.updateItem(item.id, item.quantity, item.note);
          }
        } else {
          // Yeni kalem ekleme
          await order.addItem(
            item.productId,
            item.quantity,
            item.note,
            item.options
          );
        }
      }
    }

    // İlişkili verileri içeren güncel siparişi döndür
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name']
        },
        {
          model: Table,
          attributes: ['id', 'number']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price', 'image']
          }]
        }
      ]
    });

    // Gerçek zamanlı bildirim gönder
    socketService.notifyOrderStatusUpdate(updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz sipariş bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Sipariş bulunamadı');
  }

  // Sadece bekleyen siparişler silinebilir
  if (order.status !== 'pending') {
    throw new ApiError(400, 'Sadece bekleyen siparişler silinebilir');
  }

  // Sipariş kalemlerini sil (stokları iade et)
  const items = await order.getOrderItems();
  for (const item of items) {
    await order.removeItem(item.id);
  }

  // Gerçek zamanlı bildirim gönder
  socketService.notifyOrderCancelled(order);

  await order.destroy();
  res.status(204).send();
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByPk(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Sipariş bulunamadı');
  }

  try {
    await order.updateStatus(status);

    // Sipariş tamamlandıysa veya iptal edildiyse masa durumunu güncelle
    if (['completed', 'cancelled'].includes(status)) {
      const table = await Table.findByPk(order.tableId);
      if (table) {
        const activeOrders = await Order.count({
          where: {
            tableId: table.id,
            status: {
              [Op.notIn]: ['completed', 'cancelled']
            }
          }
        });

        if (activeOrders === 0) {
          await table.updateStatus('available');
        }
      }
    }

    // Gerçek zamanlı bildirim gönder
    socketService.notifyOrderStatusUpdate(order);

    res.json(order);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Add payment to order
// @route   POST /api/orders/:id/payments
// @access  Private (Cashier only)
exports.addPayment = async (req, res) => {
  const { amount, method } = req.body;
  const order = await Order.findByPk(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Sipariş bulunamadı');
  }

  try {
    await order.addPayment(amount, method);

    // Gerçek zamanlı bildirim gönder
    socketService.notifyOrderStatusUpdate(order);

    res.json(order);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Get daily orders summary
// @route   GET /api/orders/summary/daily
// @access  Private (Admin & Manager)
exports.getDailyOrdersSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const orders = await Order.getDailyOrders(targetDate);
    
    const summary = {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      paymentMethods: orders.reduce((methods, order) => {
        order.payments.forEach(payment => {
          methods[payment.method] = (methods[payment.method] || 0) + payment.amount;
        });
        return methods;
      }, {}),
      averageOrderAmount: orders.length ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
    };

    res.json(summary);
  } catch (error) {
    console.error('Get daily orders summary error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const bulkUpdateOrderStatus = catchAsync(async (req, res) => {
  const { orders } = req.body;
  if (!Array.isArray(orders)) {
    throw new ApiError(400, 'orders must be an array');
  }

  const results = await orderService.bulkUpdateStatus(orders);
  res.json(results);
});

const bulkCreateOrders = catchAsync(async (req, res) => {
  const { orders } = req.body;
  if (!Array.isArray(orders)) {
    throw new ApiError(400, 'orders must be an array');
  }

  const results = await orderService.bulkCreate(orders);
  res.json(results);
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  addPayment,
  getDailyOrdersSummary,
  bulkUpdateOrderStatus,
  bulkCreateOrders
}; 