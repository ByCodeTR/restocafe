const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderItemStatus,
  addPayment,
  cancelOrder,
  getDailyOrdersSummary
} = require('../controllers/orderController');

// Validation middleware
const orderValidation = [
  body('table')
    .isMongoId()
    .withMessage('Geçersiz masa ID'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('En az bir ürün seçilmelidir'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Geçersiz ürün ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Miktar en az 1 olmalıdır'),
  body('items.*.variations')
    .optional()
    .isArray()
    .withMessage('Varyasyonlar dizi olmalıdır'),
  body('items.*.variations.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Varyasyon adı zorunludur'),
  body('items.*.variations.*.option.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Seçenek adı zorunludur'),
  body('customer.name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Müşteri adı en az 2 karakter olmalıdır'),
  body('customer.notes')
    .optional()
    .trim()
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'served', 'cancelled'])
    .withMessage('Geçersiz durum')
];

const paymentValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Geçersiz ödeme tutarı'),
  body('method')
    .isIn(['cash', 'credit_card', 'debit_card', 'mobile'])
    .withMessage('Geçersiz ödeme yöntemi'),
  body('transactionId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('İşlem ID boş olamaz')
];

// Routes
router.get('/', auth, getOrders);
router.get('/summary/daily', [auth, authorize('admin', 'manager')], getDailyOrdersSummary);
router.get('/:id', auth, getOrderById);
router.post('/', [auth, authorize('waiter', 'admin'), ...orderValidation], createOrder);
router.patch('/:id/items/:itemId/status', [auth, authorize('waiter', 'kitchen', 'admin'), ...statusValidation], updateOrderItemStatus);
router.post('/:id/payments', [auth, authorize('waiter', 'cashier', 'admin'), ...paymentValidation], addPayment);
router.patch('/:id/cancel', [auth, authorize('waiter', 'admin')], cancelOrder);

// Geçici olarak boş rotalar
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.patch('/:id/status', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/:id/payment', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router; 