const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/authMiddleware');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerStats
} = require('../controllers/customerController');

// Tüm rotalar için auth middleware'i
router.use(auth);

// Müşterileri listele (Garson ve Admin)
router.get('/', checkRole(['waiter', 'admin']), getCustomers);

// Müşteri detayı (Garson ve Admin)
router.get('/:id', checkRole(['waiter', 'admin']), getCustomer);

// Yeni müşteri oluştur (Garson ve Admin)
router.post('/', checkRole(['waiter', 'admin']), createCustomer);

// Müşteri güncelle (Garson ve Admin)
router.patch('/:id', checkRole(['waiter', 'admin']), updateCustomer);

// Müşteri istatistikleri (Garson ve Admin)
router.get('/:id/stats', checkRole(['waiter', 'admin']), getCustomerStats);

module.exports = router; 