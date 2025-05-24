const Order = require('../models/Order');
const Table = require('../models/Table');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
let socketService;

// Socket service setter
exports.setSocketService = (service) => {
  socketService = service;
};

// @desc    Get all orders with filters
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const {
      status,
      table,
      waiter,
      startDate,
      endDate,
      paymentStatus,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (table) query.table = table;
    if (waiter) query.waiter = waiter;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('table', 'name number')
        .populate('waiter', 'name')
        .populate('items.product', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'name number')
      .populate('waiter', 'name')
      .populate('items.product', 'name code price');

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { table: tableId, items, customer } = req.body;

    // Check if table exists and is available
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(400).json({ message: 'Masa bulunamadı' });
    }
    if (table.status === 'reserved' && table.reservedFor > new Date()) {
      return res.status(400).json({ message: 'Masa rezerve edilmiş' });
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Ürün bulunamadı: ${item.product}` });
      }

      // Check stock if tracking is enabled
      if (product.stockTracking && product.currentStock < item.quantity) {
        return res.status(400).json({ 
          message: `Yetersiz stok: ${product.name}`,
          currentStock: product.currentStock
        });
      }

      // Calculate item price with variations
      let itemPrice = product.basePrice;
      if (item.variations) {
        for (const variation of item.variations) {
          const productVariation = product.variations.find(v => v.name === variation.name);
          if (!productVariation) continue;

          const option = productVariation.options.find(o => o.name === variation.option.name);
          if (!option) continue;

          itemPrice += option.price;
        }
      }

      totalAmount += itemPrice * item.quantity;
      processedItems.push({
        ...item,
        price: itemPrice
      });

      // Update stock if tracking is enabled
      if (product.stockTracking) {
        await product.updateStock(item.quantity, 'remove');
        
        // Check if stock is low after update
        if (product.currentStock <= product.minStock) {
          socketService?.notifyLowStock(product);
        }
      }
    }

    // Create order
    const order = new Order({
      table: tableId,
      items: processedItems,
      totalAmount,
      waiter: req.user._id,
      customer
    });

    await order.save();

    // Update table status
    table.status = 'occupied';
    table.currentOrder = order._id;
    await table.save();

    // Populate references for response
    await order.populate([
      { path: 'table', select: 'name number' },
      { path: 'waiter', select: 'name' },
      { path: 'items.product', select: 'name code' }
    ]);

    // Send real-time notification
    socketService?.notifyNewOrder(order);

    res.status(201).json({
      message: 'Sipariş başarıyla oluşturuldu',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update order item status
// @route   PATCH /api/orders/:id/items/:itemId/status
// @access  Private
exports.updateOrderItemStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { id, itemId } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    const updatedItem = await order.updateItemStatus(itemId, status);
    
    // Send real-time notification
    socketService?.notifyOrderStatusUpdate(order, updatedItem);

    res.json({
      message: 'Sipariş durumu güncellendi',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update order item status error:', error);
    if (error.message === 'Sipariş kalemi bulunamadı') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Add payment to order
// @route   POST /api/orders/:id/payments
// @access  Private
exports.addPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, transactionId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    const updatedOrder = await order.addPayment({
      amount,
      method,
      transactionId,
      timestamp: new Date()
    });

    // If order is completed, update table status
    if (updatedOrder.status === 'completed') {
      await Table.findByIdAndUpdate(order.table, {
        $set: { status: 'available', currentOrder: null }
      });
    }

    // Send real-time notification
    socketService?.notifyPayment(updatedOrder);

    res.json({
      message: 'Ödeme başarıyla eklendi',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Add payment error:', error);
    if (error.message.includes('Ödeme')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ message: 'Sadece aktif siparişler iptal edilebilir' });
    }

    // Return products to stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.stockTracking) {
        await product.updateStock(item.quantity, 'add');
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Update table status
    await Table.findByIdAndUpdate(order.table, {
      $set: { status: 'available', currentOrder: null }
    });

    // Send real-time notification
    socketService?.notifyOrderCancellation(order);

    res.json({
      message: 'Sipariş başarıyla iptal edildi',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
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