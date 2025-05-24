const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const kitchenController = require('../controllers/kitchenController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const orderItemStatusValidation = [
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'served', 'cancelled'])
    .withMessage('Geçersiz sipariş kalemi durumu')
];

const issueReportValidation = [
  body('type')
    .isIn(['DELAYED_ORDER', 'EQUIPMENT_ISSUE', 'INGREDIENT_SHORTAGE'])
    .withMessage('Geçersiz uyarı tipi'),
  body('message')
    .notEmpty().withMessage('Mesaj gerekli')
    .isLength({ max: 500 }).withMessage('Mesaj çok uzun'),
  body('severity')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Geçersiz önem derecesi'),
  body('orderId')
    .optional()
    .isInt().withMessage('Geçersiz sipariş ID'),
  body('itemId')
    .optional()
    .isInt().withMessage('Geçersiz sipariş kalemi ID')
];

// Routes
router.get('/orders',
  auth,
  checkRole(['kitchen']),
  kitchenController.getActiveOrders
);

router.patch('/orders/:orderId/items/:itemId',
  auth,
  checkRole(['kitchen']),
  orderItemStatusValidation,
  validate,
  kitchenController.updateOrderItemStatus
);

router.get('/stats',
  auth,
  checkRole(['kitchen', 'admin']),
  kitchenController.getKitchenStats
);

router.post('/issues',
  auth,
  checkRole(['kitchen']),
  issueReportValidation,
  validate,
  kitchenController.reportIssue
);

router.get('/delayed-orders',
  auth,
  checkRole(['kitchen', 'admin']),
  kitchenController.getDelayedOrders
);

module.exports = router; 