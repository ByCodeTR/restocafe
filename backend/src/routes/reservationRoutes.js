const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const reservationValidation = [
  body('customerName')
    .notEmpty().withMessage('Müşteri adı gerekli')
    .isLength({ min: 2, max: 100 }).withMessage('Müşteri adı 2-100 karakter arası olmalı'),
  body('customerPhone')
    .notEmpty().withMessage('Müşteri telefonu gerekli')
    .matches(/^[0-9+\-() ]{10,20}$/).withMessage('Geçersiz telefon numarası'),
  body('customerEmail')
    .optional()
    .isEmail().withMessage('Geçersiz e-posta adresi'),
  body('date')
    .notEmpty().withMessage('Tarih gerekli')
    .isDate().withMessage('Geçersiz tarih'),
  body('time')
    .notEmpty().withMessage('Saat gerekli')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Geçersiz saat (HH:MM)'),
  body('duration')
    .optional()
    .isInt({ min: 30, max: 480 }).withMessage('Süre 30-480 dakika arası olmalı'),
  body('guestCount')
    .isInt({ min: 1 }).withMessage('Misafir sayısı en az 1 olmalı'),
  body('note')
    .optional()
    .isString().withMessage('Geçersiz not'),
  body('specialRequests')
    .optional()
    .isString().withMessage('Geçersiz özel istek'),
  body('source')
    .optional()
    .isIn(['phone', 'web', 'walk_in', 'third_party']).withMessage('Geçersiz kaynak'),
  body('tableId')
    .isInt().withMessage('Geçersiz masa ID'),
  body('customerId')
    .optional()
    .isInt().withMessage('Geçersiz müşteri ID')
];

const reservationUpdateValidation = [
  body('customerName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Müşteri adı 2-100 karakter arası olmalı'),
  body('customerPhone')
    .optional()
    .matches(/^[0-9+\-() ]{10,20}$/).withMessage('Geçersiz telefon numarası'),
  body('customerEmail')
    .optional()
    .isEmail().withMessage('Geçersiz e-posta adresi'),
  body('date')
    .optional()
    .isDate().withMessage('Geçersiz tarih'),
  body('time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Geçersiz saat (HH:MM)'),
  body('duration')
    .optional()
    .isInt({ min: 30, max: 480 }).withMessage('Süre 30-480 dakika arası olmalı'),
  body('guestCount')
    .optional()
    .isInt({ min: 1 }).withMessage('Misafir sayısı en az 1 olmalı'),
  body('note')
    .optional()
    .isString().withMessage('Geçersiz not'),
  body('specialRequests')
    .optional()
    .isString().withMessage('Geçersiz özel istek'),
  body('tableId')
    .optional()
    .isInt().withMessage('Geçersiz masa ID')
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'])
    .withMessage('Geçersiz rezervasyon durumu')
];

const availableTablesValidation = [
  query('date')
    .notEmpty().withMessage('Tarih gerekli')
    .isDate().withMessage('Geçersiz tarih'),
  query('time')
    .notEmpty().withMessage('Saat gerekli')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Geçersiz saat (HH:MM)'),
  query('duration')
    .notEmpty().withMessage('Süre gerekli')
    .isInt({ min: 30, max: 480 }).withMessage('Süre 30-480 dakika arası olmalı'),
  query('guestCount')
    .notEmpty().withMessage('Misafir sayısı gerekli')
    .isInt({ min: 1 }).withMessage('Misafir sayısı en az 1 olmalı')
];

// Routes
router.get('/', auth, reservationController.getAllReservations);
router.get('/:id', auth, reservationController.getReservationById);

router.get('/available-tables',
  auth,
  availableTablesValidation,
  validate,
  reservationController.findAvailableTables
);

router.post('/',
  auth,
  checkRole(['admin', 'manager', 'waiter']),
  reservationValidation,
  validate,
  reservationController.createReservation
);

router.put('/:id',
  auth,
  checkRole(['admin', 'manager', 'waiter']),
  reservationUpdateValidation,
  validate,
  reservationController.updateReservation
);

router.delete('/:id',
  auth,
  checkRole(['admin', 'manager']),
  reservationController.deleteReservation
);

router.patch('/:id/status',
  auth,
  checkRole(['admin', 'manager', 'waiter']),
  statusValidation,
  validate,
  reservationController.updateReservationStatus
);

module.exports = router; 