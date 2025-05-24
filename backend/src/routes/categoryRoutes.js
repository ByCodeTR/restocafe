const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const categoryValidation = [
  body('name')
    .notEmpty().withMessage('Kategori adı gerekli')
    .isLength({ min: 2, max: 50 }).withMessage('Kategori adı 2-50 karakter arası olmalı'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Açıklama en fazla 500 karakter olabilir'),
  body('parentId')
    .optional()
    .isInt().withMessage('Geçersiz üst kategori ID'),
  body('order')
    .optional()
    .isInt().withMessage('Geçersiz sıralama değeri'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('Geçersiz aktiflik durumu')
];

const reorderValidation = [
  body('orders')
    .isArray().withMessage('Sıralama verisi dizi olmalı')
    .notEmpty().withMessage('Sıralama verisi gerekli'),
  body('orders.*.id')
    .isInt().withMessage('Geçersiz kategori ID'),
  body('orders.*.order')
    .isInt().withMessage('Geçersiz sıralama değeri')
];

// Routes
router.get('/', auth, categoryController.getAllCategories);
router.get('/:id', auth, categoryController.getCategoryById);

router.post('/',
  auth,
  checkRole(['admin']),
  categoryValidation,
  validate,
  categoryController.createCategory
);

router.put('/:id',
  auth,
  checkRole(['admin']),
  categoryValidation,
  validate,
  categoryController.updateCategory
);

router.delete('/:id',
  auth,
  checkRole(['admin']),
  categoryController.deleteCategory
);

router.patch('/reorder',
  auth,
  checkRole(['admin']),
  reorderValidation,
  validate,
  categoryController.reorderCategories
);

module.exports = router; 