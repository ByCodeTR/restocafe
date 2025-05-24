import { io } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';
import { updateOrder, removeOrder } from '../store/slices/kitchenSlice';
import { updateTable } from '../store/slices/tableSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket) return;

    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners();
    this.socket.connect();
  }

  setupEventListeners() {
    // Bağlantı olayları
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Kullanıcı kimlik doğrulama
      const user = store.getState().auth.user;
      if (user) {
        this.authenticate(user);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        store.dispatch(addNotification({
          type: 'error',
          message: 'Sunucu bağlantısı kurulamadı. Lütfen sayfayı yenileyin.'
        }));
      }
    });

    // Sipariş bildirimleri
    this.socket.on('newOrder', ({ order }) => {
      store.dispatch(updateOrder(order));
      store.dispatch(addNotification({
        type: 'info',
        message: `Yeni sipariş alındı: Masa ${order.table.number}`
      }));
    });

    this.socket.on('orderStatusUpdate', ({ order, updatedItem }) => {
      store.dispatch(updateOrder(order));
      store.dispatch(addNotification({
        type: 'info',
        message: `Sipariş durumu güncellendi: ${updatedItem.product.name} - ${
          updatedItem.status === 'preparing' ? 'Hazırlanıyor' :
          updatedItem.status === 'ready' ? 'Hazır' : 'Bekliyor'
        }`
      }));
    });

    this.socket.on('orderCompleted', ({ order }) => {
      store.dispatch(removeOrder(order._id));
      store.dispatch(addNotification({
        type: 'success',
        message: `Sipariş tamamlandı: Masa ${order.table.number}`
      }));
    });

    this.socket.on('orderCancelled', ({ order }) => {
      store.dispatch(removeOrder(order._id));
      store.dispatch(addNotification({
        type: 'warning',
        message: `Sipariş iptal edildi: Masa ${order.table.number}`
      }));
    });

    // Mutfak bildirimleri
    this.socket.on('kitchenNotification', ({ type, message }) => {
      const notificationTypes = {
        ITEM_READY: 'success',
        ITEM_PREPARING: 'info',
        ITEM_PENDING: 'warning'
      };

      store.dispatch(addNotification({
        type: notificationTypes[type] || 'info',
        message
      }));
    });

    // Masa güncellemeleri
    this.socket.on('tableUpdate', ({ type, order }) => {
      store.dispatch(updateTable({
        id: order.table._id,
        changes: {
          status: order.status === 'completed' ? 'available' : 'occupied',
          currentOrder: order._id
        }
      }));
    });

    // Stok bildirimleri
    this.socket.on('lowStockAlert', ({ message, product }) => {
      store.dispatch(addNotification({
        type: 'warning',
        message,
        duration: 10000 // Düşük stok uyarıları daha uzun görünsün
      }));
    });
  }

  // Kullanıcı kimlik doğrulama
  authenticate(user) {
    if (!this.isConnected) return;
    
    this.socket.emit('authenticate', {
      userId: user._id,
      role: user.role
    });
  }

  // Mutfak ekranına katılma
  joinKitchen() {
    if (!this.isConnected) return;
    this.socket.emit('joinKitchen');
  }

  // Masa takibi
  joinTable(tableId) {
    if (!this.isConnected) return;
    this.socket.emit('joinTable', tableId);
  }

  // Bağlantıyı sonlandırma
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService; 