const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const tableRoutes = require('./tableRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Table routes
router.use('/tables', tableRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Add other routes here as they are created
// router.use('/orders', orderRoutes);

module.exports = router; 