// Rezervasyon olayları
const handleReservationEvents = (socket) => {
  // Rezervasyon odasına katılma
  socket.on('joinReservations', () => {
    socket.join('reservations');
    console.log(`Socket ${socket.id} joined reservations room`);
  });

  // Rezervasyon odasından ayrılma
  socket.on('leaveReservations', () => {
    socket.leave('reservations');
    console.log(`Socket ${socket.id} left reservations room`);
  });
};

// Socket bağlantı yönetimi
const handleConnection = (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Kimlik doğrulama
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      console.log(`Socket ${socket.id} authenticated as ${decoded.name}`);
    } catch (error) {
      console.error(`Socket ${socket.id} authentication failed:`, error);
      socket.disconnect();
    }
  });

  // Olay dinleyicileri
  handleTableEvents(socket);
  handleOrderEvents(socket);
  handleKitchenEvents(socket);
  handleReservationEvents(socket);

  // Bağlantı kesme
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};

// Odalara bildirim gönderme
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

// Socket.IO başlatma
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', handleConnection);
  console.log('Socket.IO initialized');
};

module.exports = {
  initializeSocket,
  emitToRoom,
  getIO: () => io
}; 