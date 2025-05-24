const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tableController = require('../controllers/tableController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const tableValidation = [
  body('number').notEmpty().withMessage('Masa numarası gerekli'),
  body('capacity').isInt({ min: 1, max: 20 }).withMessage('Kapasite 1-20 arası olmalı'),
  body('location').optional().isString().withMessage('Geçersiz konum'),
  body('isActive').optional().isBoolean().withMessage('Geçersiz aktiflik durumu')
];

const statusValidation = [
  body('status')
    .isIn(['available', 'occupied', 'reserved', 'maintenance'])
    .withMessage('Geçersiz masa durumu')
];

const waiterValidation = [
  body('waiterId').isInt().withMessage('Geçersiz garson ID')
];

// Public routes
router.get('/available', tableController.getAvailableTables);

// Protected routes
router.use(auth);

// Tüm masaları listele (Tüm personel)
router.get('/', tableController.getTables);

// Masa detayı (Tüm personel)
router.get('/:id', tableController.getTableById);

// Masa oluştur (Admin)
router.post(
  '/',
  checkRole(['admin']),
  tableValidation,
  validate,
  tableController.createTable
);

// Masa güncelle (Admin)
router.put(
  '/:id',
  checkRole(['admin']),
  tableValidation,
  validate,
  tableController.updateTable
);

// Masa sil (Admin)
router.delete(
  '/:id',
  checkRole(['admin']),
  tableController.deleteTable
);

// Masa durumu güncelle (Garson, Admin)
router.patch(
  '/:id/status',
  checkRole(['waiter', 'admin']),
  statusValidation,
  validate,
  tableController.updateTableStatus
);

// Masaya garson ata (Admin, Manager)
router.post(
  '/:id/waiter',
  checkRole(['admin', 'manager']),
  waiterValidation,
  validate,
  tableController.assignWaiter
);

// Masadan garson kaldır (Admin, Manager)
router.delete(
  '/:id/waiter',
  checkRole(['admin', 'manager']),
  tableController.removeWaiter
);

// QR kod yenile (Admin)
router.post(
  '/:id/qr-code',
  checkRole(['admin']),
  tableController.regenerateQRCode
);

// QR kod doğrula (Tüm personel)
router.post(
  '/:id/verify-qr',
  tableController.verifyQRCode
);

module.exports = router; 