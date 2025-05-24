const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const orderValidation = [
  body('tableId')
    .isInt().withMessage('Geçersiz masa ID'),
  body('customerId')
    .optional()
    .isInt().withMessage('Geçersiz müşteri ID'),
  body('note')
    .optional()
    .isString().withMessage('Geçersiz not'),
  body('items')
    .isArray().withMessage('Ürünler dizi olmalı')
    .notEmpty().withMessage('En az bir ürün gerekli'),
  body('items.*.productId')
    .isInt().withMessage('Geçersiz ürün ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Miktar 1 veya daha büyük olmalı'),
  body('items.*.note')
    .optional()
    .isString().withMessage('Geçersiz ürün notu'),
  body('items.*.options')
    .optional()
    .isObject().withMessage('Geçersiz ürün seçenekleri')
];

const orderUpdateValidation = [
  body('note')
    .optional()
    .isString().withMessage('Geçersiz not'),
  body('items')
    .isArray().withMessage('Ürünler dizi olmalı')
    .notEmpty().withMessage('En az bir ürün gerekli'),
  body('items.*.id')
    .optional()
    .isInt().withMessage('Geçersiz ürün kalemi ID'),
  body('items.*.productId')
    .optional()
    .isInt().withMessage('Geçersiz ürün ID'),
  body('items.*.quantity')
    .isInt({ min: 0 }).withMessage('Miktar 0 veya daha büyük olmalı'),
  body('items.*.note')
    .optional()
    .isString().withMessage('Geçersiz ürün notu'),
  body('items.*.options')
    .optional()
    .isObject().withMessage('Geçersiz ürün seçenekleri')
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'])
    .withMessage('Geçersiz sipariş durumu')
];

const paymentValidation = [
  body('amount')
    .isFloat({ min: 0.01 }).withMessage('Geçersiz ödeme tutarı'),
  body('method')
    .isIn(['cash', 'credit_card', 'debit_card', 'mobile_payment'])
    .withMessage('Geçersiz ödeme yöntemi')
];

// Routes
router.get('/', auth, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrderById);

router.post('/',
  auth,
  checkRole(['waiter']),
  orderValidation,
  validate,
  orderController.createOrder
);

router.put('/:id',
  auth,
  checkRole(['waiter']),
  orderUpdateValidation,
  validate,
  orderController.updateOrder
);

router.delete('/:id',
  auth,
  checkRole(['admin']),
  orderController.deleteOrder
);

router.patch('/:id/status',
  auth,
  checkRole(['admin', 'waiter', 'kitchen']),
  statusValidation,
  validate,
  orderController.updateOrderStatus
);

router.post('/:id/payments',
  auth,
  checkRole(['cashier']),
  paymentValidation,
  validate,
  orderController.addPayment
);

module.exports = router; 