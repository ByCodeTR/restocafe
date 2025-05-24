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
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');
const defineAssociations = require('./models/associations');
const compression = require('compression');
const morgan = require('morgan');

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
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // Her IP için 15 dakikada maksimum 100 istek
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

// Define model associations
defineAssociations();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);

// Ana route
app.get('/', (req, res) => {
  res.json({
    message: 'RestoCafe API',
    version: '1.0.0',
    status: 'active'
  });
});

// API Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/kitchen', require('./routes/kitchenRoutes'));

// Error handling
app.use(errorHandler);

module.exports = { app, httpServer }; 