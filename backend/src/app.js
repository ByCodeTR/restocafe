const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/db');
const SocketService = require('./services/socketService');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Initialize socket service
const socketService = new SocketService(io);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL bağlantısı başarılı');
    return sequelize.sync({ alter: true }); // Tabloları otomatik oluştur/güncelle
  })
  .then(() => {
    console.log('Veritabanı tabloları senkronize edildi');
  })
  .catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
  });

// Ana route
app.get('/', (req, res) => {
  res.json({
    message: 'RestoCafe API',
    version: '1.0.0',
    status: 'active'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Error handling
app.use(errorHandler);

module.exports = { app, httpServer }; 