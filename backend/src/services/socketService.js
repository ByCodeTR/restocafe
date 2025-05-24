const Order = require('../models/Order');

class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedKitchens = new Set(); // socketIds of kitchen clients
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Kullanıcı kimlik doğrulama
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(data.userId, socket.id);
          socket.userId = data.userId;
          socket.role = data.role;

          // Mutfak kullanıcılarını ayrıca takip et
          if (data.role === 'kitchen') {
            this.connectedKitchens.add(socket.id);
          }

          console.log(`User authenticated: ${data.userId} (${data.role})`);
        }
      });

      // Mutfak ekranına bağlanma
      socket.on('joinKitchen', () => {
        socket.join('kitchen');
        console.log('Client joined kitchen room:', socket.id);
      });

      // Masa takibi
      socket.on('joinTable', (tableId) => {
        socket.join(`table:${tableId}`);
        console.log(`Client joined table room: ${tableId}`);
      });

      // Bağlantı koptuğunda
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        if (this.connectedKitchens.has(socket.id)) {
          this.connectedKitchens.delete(socket.id);
        }
        console.log('Client disconnected:', socket.id);
      });
    });
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