const Order = require('../models/Order');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

class SocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST']
      }
    });

    // JWT Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        socket.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedKitchens = new Set(); // socketIds of kitchen clients
    this.userSockets = new Map(); // socketId -> userId
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.user.id}`);

      // Kullanıcı kimlik doğrulama
      socket.on('authenticate', async (data) => {
        try {
          const { userId, roles } = data;
          await this.authenticateUser(socket, userId, roles);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Kimlik doğrulama hatası' });
        }
      });

      // Rol bazlı odalara katılma
      socket.on('joinRooms', (roles) => {
        try {
          this.joinRoleRooms(socket, roles);
        } catch (error) {
          console.error('Join rooms error:', error);
        }
      });

      // Masa takibi
      socket.on('watchTable', (tableId) => {
        socket.join(`table:${tableId}`);
        logger.info(`User ${socket.user.id} started watching table ${tableId}`);
      });

      // Masa takibini bırakma
      socket.on('unwatchTable', (tableId) => {
        socket.leave(`table:${tableId}`);
        logger.info(`User ${socket.user.id} stopped watching table ${tableId}`);
      });

      // Bağlantı koptuğunda
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

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
    });
  }

  // Kullanıcı kimlik doğrulama
  async authenticateUser(socket, userId, roles) {
    // Önceki bağlantıyı temizle
    const existingSocketId = this.connectedUsers.get(userId);
    if (existingSocketId) {
      this.io.to(existingSocketId).emit('forceDisconnect', {
        message: 'Başka bir cihazdan giriş yapıldı'
      });
    }

    // Yeni bağlantıyı kaydet
    this.connectedUsers.set(userId, socket.id);
    this.userSockets.set(socket.id, userId);

    // Rol bazlı odalara katıl
    this.joinRoleRooms(socket, roles);

    socket.emit('authenticated', { userId });
  }

  // Rol bazlı odalara katılma
  joinRoleRooms(socket, roles) {
    if (roles.includes('kitchen')) {
      socket.join('kitchen');
      this.connectedKitchens.add(socket.id);
    }
    
    roles.forEach(role => {
      socket.join(`role:${role}`);
    });

    // Tüm personeli personel odasına ekle
    socket.join('staff');
  }

  // Bağlantı kopması durumu
  handleDisconnect(socket) {
    logger.info(`User disconnected: ${socket.user.id}`);

    // Mutfak bağlantısını temizle
    if (this.connectedKitchens.has(socket.id)) {
      this.connectedKitchens.delete(socket.id);
    }

    // Kullanıcı bağlantısını temizle
    const userId = this.userSockets.get(socket.id);
    if (userId) {
      this.connectedUsers.delete(userId);
      this.userSockets.delete(socket.id);
    }
  }

  // Kullanıcı bilgisi alma
  getUserById(userId) {
    // Bu metod User modelinden kullanıcı bilgilerini almalı
    // Şimdilik mock veri dönüyoruz
    return {
      id: userId,
      roles: ['waiter'] // Gerçek uygulamada veritabanından alınmalı
    };
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

  // Rol bazlı bildirim gönderme
  notifyByRole(roles, event, data) {
    try {
      // Belirtilen rollere sahip tüm bağlı kullanıcılara bildirim gönder
      this.connectedUsers.forEach((socketId, userId) => {
        const user = this.getUserById(userId);
        if (user && roles.some(role => user.roles.includes(role))) {
          this.io.to(socketId).emit(event, data);
        }
      });
    } catch (error) {
      console.error('Notify by role error:', error);
    }
  }

  // Stok uyarısı bildirimi
  notifyLowStock(product) {
    try {
      const notification = {
        type: 'LOW_STOCK_ALERT',
        message: `${product.name} ürününün stok seviyesi düşük (${product.stock} ${product.unit} kaldı)`,
        product: {
          id: product.id,
          name: product.name,
          stock: product.stock,
          unit: product.unit
        }
      };

      // Yöneticilere ve mutfak personeline bildir
      this.notifyByRole(['admin', 'manager', 'kitchen'], 'stockAlert', notification);
    } catch (error) {
      console.error('Notify low stock error:', error);
    }
  }

  // Stok tükenme bildirimi
  notifyOutOfStock(product) {
    try {
      const notification = {
        type: 'OUT_OF_STOCK_ALERT',
        message: `${product.name} ürünü tükendi!`,
        product: {
          id: product.id,
          name: product.name,
          stock: product.stock,
          unit: product.unit
        }
      };

      // Tüm personele bildir
      this.notifyByRole(['admin', 'manager', 'kitchen', 'waiter'], 'stockAlert', notification);

      // Ürünün durumunu güncelle
      this.io.emit('productAvailabilityChanged', {
        productId: product.id,
        isAvailable: false
      });
    } catch (error) {
      console.error('Notify out of stock error:', error);
    }
  }

  // Masa atama bildirimi
  notifyTableAssigned(tableId, waiterId) {
    try {
      // Garsona bildirim gönder
      const waiterSocketId = this.connectedUsers.get(waiterId.toString());
      if (waiterSocketId) {
        this.io.to(waiterSocketId).emit('tableAssigned', {
          type: 'TABLE_ASSIGNED',
          message: `Masa #${tableId} size atandı`,
          tableId
        });
      }

      // Yöneticilere bildirim gönder
      this.notifyByRole(['admin', 'manager'], 'tableAssignment', {
        type: 'TABLE_ASSIGNMENT_UPDATE',
        tableId,
        waiterId
      });
    } catch (error) {
      console.error('Notify table assigned error:', error);
    }
  }

  // Rezervasyon bildirimi
  notifyReservationUpdate(reservation) {
    try {
      const notifications = {
        confirmed: 'onaylandı',
        seated: 'müşteri masaya oturdu',
        completed: 'tamamlandı',
        cancelled: 'iptal edildi',
        no_show: 'müşteri gelmedi'
      };

      // İlgili garsona bildirim
      if (reservation.waiterId) {
        const waiterSocketId = this.connectedUsers.get(reservation.waiterId.toString());
        if (waiterSocketId) {
          this.io.to(waiterSocketId).emit('reservationNotification', {
            type: 'RESERVATION_UPDATE',
            message: `Rezervasyon #${reservation.id} ${notifications[reservation.status]}`,
            reservation
          });
        }
      }

      // Yöneticilere bildirim
      this.notifyByRole(['admin', 'manager'], 'reservationUpdate', {
        type: 'RESERVATION_STATUS_UPDATE',
        reservation
      });
    } catch (error) {
      console.error('Notify reservation update error:', error);
    }
  }

  // Mutfak bildirimleri
  notifyKitchen(event, data) {
    this.io.to('kitchen').emit(event, data);
  }

  // Yeni sipariş bildirimi (Mutfak)
  notifyKitchenNewOrder(order) {
    const kitchenOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.product.name,
        quantity: item.quantity,
        note: item.note,
        status: item.status,
        options: item.options
      })),
      table: {
        number: order.table.number,
        name: order.table.name
      },
      waiter: {
        name: order.waiter.name
      },
      createdAt: order.createdAt
    };

    this.notifyKitchen('newKitchenOrder', {
      type: 'NEW_KITCHEN_ORDER',
      order: kitchenOrder
    });
  }

  // Sipariş durumu güncelleme (Mutfak)
  notifyKitchenOrderUpdate(order, updatedItem) {
    const kitchenUpdate = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      item: {
        id: updatedItem.id,
        productName: updatedItem.product.name,
        quantity: updatedItem.quantity,
        status: updatedItem.status,
        note: updatedItem.note
      },
      table: {
        number: order.table.number
      }
    };

    this.notifyKitchen('kitchenOrderUpdate', {
      type: 'KITCHEN_ORDER_UPDATE',
      update: kitchenUpdate
    });
  }

  // Sipariş iptal bildirimi (Mutfak)
  notifyKitchenOrderCancelled(order, cancelledItems) {
    const kitchenCancellation = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      items: cancelledItems.map(item => ({
        id: item.id,
        productName: item.product.name,
        quantity: item.quantity
      })),
      table: {
        number: order.table.number
      }
    };

    this.notifyKitchen('kitchenOrderCancelled', {
      type: 'KITCHEN_ORDER_CANCELLED',
      cancellation: kitchenCancellation
    });
  }

  // Mutfak istatistikleri güncelleme
  updateKitchenStats(stats) {
    const kitchenStats = {
      activeOrders: stats.activeOrders,
      preparingItems: stats.preparingItems,
      readyItems: stats.readyItems,
      averagePreparationTime: stats.averagePreparationTime,
      busyStations: stats.busyStations
    };

    this.notifyKitchen('kitchenStatsUpdate', {
      type: 'KITCHEN_STATS_UPDATE',
      stats: kitchenStats
    });
  }

  // Mutfak uyarıları
  notifyKitchenAlert(alert) {
    const kitchenAlert = {
      type: alert.type, // 'DELAYED_ORDER', 'EQUIPMENT_ISSUE', 'INGREDIENT_SHORTAGE'
      message: alert.message,
      severity: alert.severity, // 'low', 'medium', 'high'
      orderId: alert.orderId,
      itemId: alert.itemId,
      createdAt: new Date()
    };

    this.notifyKitchen('kitchenAlert', {
      type: 'KITCHEN_ALERT',
      alert: kitchenAlert
    });
  }
}

const initializeSocket = (server) => {
  const io = new SocketService(server);

  io.io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.id}`);

    // Masa olayları
    handleTableEvents(socket);

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });

  return io.io;
};

const handleTableEvents = (socket) => {
  // Masa takibi başlat
  socket.on('watchTable', (tableId) => {
    socket.join(`table:${tableId}`);
    logger.info(`User ${socket.user.id} started watching table ${tableId}`);
  });

  // Masa takibini sonlandır
  socket.on('unwatchTable', (tableId) => {
    socket.leave(`table:${tableId}`);
    logger.info(`User ${socket.user.id} stopped watching table ${tableId}`);
  });
};

// Masa durumu güncellendiğinde bildirim gönder
const emitTableStatusUpdate = (tableId, table) => {
  if (!io) return;

  // Masa odasına bildirim gönder
  io.to(`table:${tableId}`).emit('tableStatusUpdated', table);

  // Personele bildirim gönder
  io.to('staff').emit('tableStatusUpdated', {
    tableId,
    status: table.status,
    updatedAt: table.updatedAt
  });

  // Garsonlara özel bildirim
  if (table.status === 'occupied') {
    io.to('role:waiter').emit('newTableOccupied', {
      tableId,
      tableNumber: table.number
    });
  }
};

// Garson ataması güncellendiğinde bildirim gönder
const emitWaiterAssignment = (tableId, table, previousWaiterId) => {
  if (!io) return;

  // Masa odasına bildirim gönder
  io.to(`table:${tableId}`).emit('waiterAssigned', {
    tableId,
    currentWaiterId: table.currentWaiterId,
    previousWaiterId
  });

  // Önceki garsona bildirim gönder
  if (previousWaiterId) {
    io.to(`user:${previousWaiterId}`).emit('tableUnassigned', {
      tableId,
      tableNumber: table.number
    });
  }

  // Yeni garsona bildirim gönder
  if (table.currentWaiterId) {
    io.to(`user:${table.currentWaiterId}`).emit('tableAssigned', {
      tableId,
      tableNumber: table.number
    });
  }
};

// QR kod okutulduğunda bildirim gönder
const emitQRCodeScanned = (tableId, userId) => {
  if (!io) return;

  io.to(`table:${tableId}`).emit('qrCodeScanned', {
    tableId,
    userId,
    scannedAt: new Date()
  });
};

module.exports = {
  initializeSocket,
  emitTableStatusUpdate,
  emitWaiterAssignment,
  emitQRCodeScanned
}; 