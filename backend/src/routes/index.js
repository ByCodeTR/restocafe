const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Add other routes here as they are created
// router.use('/tables', tableRoutes);
// router.use('/orders', orderRoutes);
// router.use('/products', productRoutes);

module.exports = router; 