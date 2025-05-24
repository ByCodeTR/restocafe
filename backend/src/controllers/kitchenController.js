const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { ValidationError, Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const socketService = require('../services/socketService');

// @desc    Get active kitchen orders
// @route   GET /api/kitchen/orders
// @access  Private (Kitchen only)
exports.getActiveOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: {
      status: {
        [Op.in]: ['pending', 'preparing']
      }
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        where: {
          status: {
            [Op.in]: ['pending', 'preparing']
          }
        },
        include: [{
          model: Product,
          attributes: ['id', 'name', 'preparationTime']
        }]
      }
    ],
    order: [['createdAt', 'ASC']]
  });

  res.json(orders);
};

// @desc    Update order item status
// @route   PATCH /api/kitchen/orders/:orderId/items/:itemId
// @access  Private (Kitchen only)
exports.updateOrderItemStatus = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  const orderItem = await OrderItem.findOne({
    where: {
      id: itemId,
      orderId
    },
    include: [{
      model: Product,
      attributes: ['id', 'name']
    }]
  });

  if (!orderItem) {
    throw new ApiError(404, 'Sipariş kalemi bulunamadı');
  }

  try {
    await orderItem.updateStatus(status);

    // Siparişin tüm kalemlerini kontrol et
    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }]
    });

    // Tüm kalemler hazırsa siparişi hazır durumuna getir
    const allItemsReady = order.orderItems.every(item => item.status === 'ready');
    if (allItemsReady) {
      await order.updateStatus('ready');
    }

    // Mutfağa bildirim gönder
    socketService.notifyKitchenOrderUpdate(order, orderItem);

    res.json(orderItem);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Get kitchen statistics
// @route   GET /api/kitchen/stats
// @access  Private (Kitchen, Admin only)
exports.getKitchenStats = async (req, res) => {
  const stats = {
    activeOrders: 0,
    preparingItems: 0,
    readyItems: 0,
    averagePreparationTime: 0,
    busyStations: 0
  };

  // Aktif siparişleri say
  stats.activeOrders = await Order.count({
    where: {
      status: {
        [Op.in]: ['pending', 'preparing']
      }
    }
  });

  // Hazırlanan ve hazır kalemleri say
  const items = await OrderItem.findAll({
    where: {
      status: {
        [Op.in]: ['preparing', 'ready']
      }
    },
    attributes: ['status']
  });

  stats.preparingItems = items.filter(item => item.status === 'preparing').length;
  stats.readyItems = items.filter(item => item.status === 'ready').length;

  // Ortalama hazırlama süresini hesapla
  const completedItems = await OrderItem.findAll({
    where: {
      status: 'ready',
      updatedAt: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Son 24 saat
      }
    },
    attributes: ['createdAt', 'updatedAt']
  });

  if (completedItems.length > 0) {
    const totalPreparationTime = completedItems.reduce((sum, item) => {
      return sum + (item.updatedAt - item.createdAt);
    }, 0);
    stats.averagePreparationTime = Math.round(totalPreparationTime / completedItems.length / 1000 / 60); // Dakika cinsinden
  }

  // İstatistikleri güncelle
  socketService.updateKitchenStats(stats);

  res.json(stats);
};

// @desc    Report kitchen issue
// @route   POST /api/kitchen/issues
// @access  Private (Kitchen only)
exports.reportIssue = async (req, res) => {
  const { type, message, severity, orderId, itemId } = req.body;

  // Mutfak uyarısı gönder
  socketService.notifyKitchenAlert({
    type,
    message,
    severity,
    orderId,
    itemId
  });

  res.status(201).json({ message: 'Uyarı gönderildi' });
};

// @desc    Get delayed orders
// @route   GET /api/kitchen/delayed-orders
// @access  Private (Kitchen, Admin only)
exports.getDelayedOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: {
      status: {
        [Op.in]: ['pending', 'preparing']
      },
      createdAt: {
        [Op.lte]: new Date(Date.now() - 30 * 60 * 1000) // 30 dakikadan eski siparişler
      }
    },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          attributes: ['id', 'name', 'preparationTime']
        }]
      }
    ],
    order: [['createdAt', 'ASC']]
  });

  res.json(orders);
}; 