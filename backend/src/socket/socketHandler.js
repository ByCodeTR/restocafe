const socketHandler = (socket) => {
  console.log('New client connected:', socket.id);

  // Join room based on user role
  socket.on('join_role', (role) => {
    socket.join(role);
    console.log(`User joined ${role} room`);
  });

  // Handle new order
  socket.on('new_order', (order) => {
    socket.to('kitchen').emit('order_received', order);
    console.log('New order sent to kitchen:', order.id);
  });

  // Handle order status updates
  socket.on('update_order_status', (data) => {
    const { orderId, status, role } = data;
    
    // Broadcast to all relevant roles
    socket.to('waiter').to('kitchen').to('admin').emit('order_status_changed', {
      orderId,
      status,
      updatedBy: role
    });
  });

  // Handle table status updates
  socket.on('update_table_status', (data) => {
    const { tableId, status, waiterId } = data;
    
    socket.broadcast.emit('table_status_changed', {
      tableId,
      status,
      waiterId
    });
  });

  // Handle low stock notifications
  socket.on('low_stock_alert', (product) => {
    socket.to('admin').emit('stock_alert', product);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
};

module.exports = socketHandler; 