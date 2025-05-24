const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/authMiddleware');
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  checkAvailableTables
} = require('../controllers/reservationController');

// Tüm rotalar için auth middleware'i
router.use(auth);

// Rezervasyonları listele
router.get('/', getReservations);

// Rezervasyon detayı
router.get('/:id', getReservation);

// Yeni rezervasyon oluştur (Garson ve Admin)
router.post('/', checkRole(['waiter', 'admin']), createReservation);

// Rezervasyon güncelle (Garson ve Admin)
router.patch('/:id', checkRole(['waiter', 'admin']), updateReservation);

// Rezervasyon iptal et (Garson ve Admin)
router.patch('/:id/cancel', checkRole(['waiter', 'admin']), cancelReservation);

// Müsait masaları kontrol et
router.get('/tables/available', checkAvailableTables);

module.exports = router; 