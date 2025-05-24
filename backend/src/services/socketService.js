const Order = require('../models/Order');

class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedKitchens = new Set(); // socketIds of kitchen clients
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Masa durumu değişikliği
      socket.on('tableStatusChange', (data) => {
        this.io.emit('tableStatusUpdated', data);
      });

      // Yeni sipariş
      socket.on('newOrder', (data) => {
        this.io.emit('orderCreated', data);
      });

      // Sipariş durumu değişikliği
      socket.on('orderStatusChange', (data) => {
        this.io.emit('orderStatusUpdated', data);
      });

      // Yeni rezervasyon
      socket.on('newReservation', (data) => {
        this.io.emit('reservationCreated', data);
      });

      // Rezervasyon durumu değişikliği
      socket.on('reservationStatusChange', (data) => {
        this.io.emit('reservationStatusUpdated', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Masa durumunu güncelle
  updateTableStatus(tableId, status) {
    this.io.emit('tableStatusUpdated', { tableId, status });
  }

  // Yeni sipariş bildirimi
  notifyNewOrder(order) {
    this.io.emit('orderCreated', order);
  }

  // Sipariş durumu güncelleme bildirimi
  notifyOrderStatusUpdate(orderId, status) {
    this.io.emit('orderStatusUpdated', { orderId, status });
  }

  // Yeni rezervasyon bildirimi
  notifyNewReservation(reservation) {
    this.io.emit('reservationCreated', reservation);
  }

  // Rezervasyon durumu güncelleme bildirimi
  notifyReservationStatusUpdate(reservationId, status) {
    this.io.emit('reservationStatusUpdated', { reservationId, status });
  }

  // Yeni sipariş bildirimi
  async notifyNewOrder(order) {
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate('table', 'name number')
        .populate('waiter', 'name')
        .populate('items.product', 'name code');

      // Mutfağa bildirim gönder
      this.io.to('kitchen').emit('newOrder', {
        type: 'NEW_ORDER',
        order: populatedOrder
      });

      // İlgili garsona bildirim gönder
      const waiterSocketId = this.connectedUsers.get(order.waiter.toString());
      if (waiterSocketId) {
        this.io.to(waiterSocketId).emit('orderNotification', {
          type: 'ORDER_CREATED',
          message: `Sipariş #${order._id} başarıyla oluşturuldu`,
          order: populatedOrder
        });
      }

      // Masaya özel bildirim
      this.io.to(`table:${order.table}`).emit('tableUpdate', {
        type: 'NEW_ORDER',
        order: populatedOrder
      });
    } catch (error) {
      console.error('Notify new order error:', error);
    }
  }

  // Sipariş durumu değişikliği bildirimi
  async notifyOrderStatusUpdate(order, updatedItem) {
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate('table', 'name number')
        .populate('waiter', 'name')
        .populate('items.product', 'name code');

      const notifications = {
        preparing: 'hazırlanmaya başlandı',
        ready: 'hazır',
        served: 'servis edildi',
        cancelled: 'iptal edildi'
      };

      // Mutfağa bildirim
      this.io.to('kitchen').emit('orderStatusUpdate', {
        type: 'ORDER_ITEM_STATUS_UPDATE',
        order: populatedOrder,
        updatedItem
      });

      // Garsona bildirim
      const waiterSocketId = this.connectedUsers.get(order.waiter.toString());
      if (waiterSocketId) {
        this.io.to(waiterSocketId).emit('orderNotification', {
          type: 'ORDER_STATUS_UPDATE',
          message: `Sipariş #${order._id} - ${updatedItem.product.name} ${notifications[updatedItem.status]}`,
          order: populatedOrder,
          updatedItem
        });
      }

      // Masaya bildirim
      this.io.to(`table:${order.table}`).emit('tableUpdate', {
        type: 'ORDER_STATUS_UPDATE',
        order: populatedOrder,
        updatedItem
      });
    } catch (error) {
      console.error('Notify order status update error:', error);
    }
  }

  // Ödeme bildirimi
  async notifyPayment(order) {
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate('table', 'name number')
        .populate('waiter', 'name');

      // Garsona bildirim
      const waiterSocketId = this.connectedUsers.get(order.waiter.toString());
      if (waiterSocketId) {
        this.io.to(waiterSocketId).emit('orderNotification', {
          type: 'PAYMENT_ADDED',
          message: `Sipariş #${order._id} için ödeme alındı`,
          order: populatedOrder
        });
      }

      // Masaya bildirim
      this.io.to(`table:${order.table}`).emit('tableUpdate', {
        type: 'PAYMENT_ADDED',
        order: populatedOrder
      });

      // Sipariş tamamlandıysa mutfağa da bildir
      if (order.status === 'completed') {
        this.io.to('kitchen').emit('orderCompleted', {
          type: 'ORDER_COMPLETED',
          order: populatedOrder
        });
      }
    } catch (error) {
      console.error('Notify payment error:', error);
    }
  }

  // Sipariş iptali bildirimi
  async notifyOrderCancellation(order) {
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate('table', 'name number')
        .populate('waiter', 'name')
        .populate('items.product', 'name code');

      // Mutfağa bildirim
      this.io.to('kitchen').emit('orderCancelled', {
        type: 'ORDER_CANCELLED',
        order: populatedOrder
      });

      // Garsona bildirim
      const waiterSocketId = this.connectedUsers.get(order.waiter.toString());
      if (waiterSocketId) {
        this.io.to(waiterSocketId).emit('orderNotification', {
          type: 'ORDER_CANCELLED',
          message: `Sipariş #${order._id} iptal edildi`,
          order: populatedOrder
        });
      }

      // Masaya bildirim
      this.io.to(`table:${order.table}`).emit('tableUpdate', {
        type: 'ORDER_CANCELLED',
        order: populatedOrder
      });
    } catch (error) {
      console.error('Notify order cancellation error:', error);
    }
  }

  // Düşük stok bildirimi
  notifyLowStock(product) {
    // Admin ve yöneticilere bildirim gönder
    this.connectedUsers.forEach((socketId, userId) => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket && ['admin', 'manager'].includes(socket.role)) {
        this.io.to(socketId).emit('lowStockAlert', {
          type: 'LOW_STOCK',
          message: `${product.name} için stok seviyesi düşük (Mevcut: ${product.currentStock})`,
          product
        });
      }
    });
  }
}

module.exports = SocketService; 