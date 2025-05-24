const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// Validation rules
const productValidation = [
  body('name')
    .notEmpty().withMessage('Ürün adı gerekli')
    .isLength({ min: 2, max: 100 }).withMessage('Ürün adı 2-100 karakter arası olmalı'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Açıklama en fazla 1000 karakter olabilir'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Geçersiz fiyat'),
  body('discountedPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Geçersiz indirimli fiyat')
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('İndirimli fiyat normal fiyattan yüksek olamaz');
      }
      return true;
    }),
  body('stock')
    .isInt({ min: 0 }).withMessage('Geçersiz stok miktarı'),
  body('unit')
    .notEmpty().withMessage('Birim gerekli'),
  body('preparationTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Geçersiz hazırlama süresi'),
  body('calories')
    .optional()
    .isInt({ min: 0 }).withMessage('Geçersiz kalori değeri'),
  body('spicyLevel')
    .optional()
    .isInt({ min: 0, max: 5 }).withMessage('Acılık seviyesi 0-5 arası olmalı'),
  body('categoryId')
    .isInt().withMessage('Geçersiz kategori'),
  body('parentId')
    .optional()
    .isInt().withMessage('Geçersiz ana ürün'),
  body('isVegetarian')
    .optional()
    .isBoolean().withMessage('Geçersiz vejetaryen değeri'),
  body('isVegan')
    .optional()
    .isBoolean().withMessage('Geçersiz vegan değeri'),
  body('isGlutenFree')
    .optional()
    .isBoolean().withMessage('Geçersiz gluten içermez değeri'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('Geçersiz aktiflik durumu'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('Geçersiz kullanılabilirlik durumu')
];

const stockValidation = [
  body('stock')
    .isInt({ min: 0 }).withMessage('Geçersiz stok miktarı')
];

const availabilityValidation = [
  body('isAvailable')
    .isBoolean().withMessage('Geçersiz kullanılabilirlik değeri')
];

// Routes
router.get('/', auth, productController.getAllProducts);
router.get('/:id', auth, productController.getProductById);

router.post('/',
  auth,
  checkRole(['admin']),
  productValidation,
  validate,
  productController.createProduct
);

router.put('/:id',
  auth,
  checkRole(['admin']),
  productValidation,
  validate,
  productController.updateProduct
);

router.delete('/:id',
  auth,
  checkRole(['admin']),
  productController.deleteProduct
);

router.patch('/:id/stock',
  auth,
  checkRole(['admin', 'kitchen']),
  stockValidation,
  validate,
  productController.updateStock
);

router.patch('/:id/availability',
  auth,
  checkRole(['admin', 'kitchen']),
  availabilityValidation,
  validate,
  productController.updateAvailability
);

module.exports = router; 