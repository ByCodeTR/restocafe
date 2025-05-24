const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');

// Validation middleware
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Ürün adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Ürün adı en az 2 karakter olmalıdır'),
  body('category')
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0\'dan büyük bir sayı olmalıdır'),
  body('variations.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Varyasyon adı zorunludur'),
  body('variations.*.options.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Seçenek adı zorunludur'),
  body('variations.*.options.*.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Seçenek fiyatı 0\'dan büyük bir sayı olmalıdır'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Geçersiz resim URL'),
  body('currentStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stok miktarı 0\'dan küçük olamaz'),
  body('minStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stok miktarı 0\'dan küçük olamaz'),
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Hazırlama süresi 0\'dan küçük olamaz'),
  body('code')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9-_]+$/)
    .withMessage('Ürün kodu sadece harf, rakam, tire ve alt çizgi içerebilir'),
  body('nutritionalInfo.calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Kalori değeri 0\'dan büyük bir sayı olmalıdır'),
  body('nutritionalInfo.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein değeri 0\'dan büyük bir sayı olmalıdır'),
  body('nutritionalInfo.carbohydrates')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Karbonhidrat değeri 0\'dan büyük bir sayı olmalıdır'),
  body('nutritionalInfo.fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Yağ değeri 0\'dan büyük bir sayı olmalıdır')
];

const stockValidation = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Miktar 1\'den büyük bir tam sayı olmalıdır'),
  body('type')
    .isIn(['add', 'remove'])
    .withMessage('Geçersiz işlem tipi')
];

// Routes
router.get('/', auth, getProducts);
router.get('/low-stock', [auth, authorize('admin', 'kitchen')], getLowStockProducts);
router.get('/:id', auth, getProductById);
router.post('/', [auth, authorize('admin'), ...productValidation], createProduct);
router.put('/:id', [auth, authorize('admin'), ...productValidation], updateProduct);
router.delete('/:id', [auth, authorize('admin')], deleteProduct);
router.patch('/:id/stock', [auth, authorize('admin', 'kitchen'), ...stockValidation], updateStock);

module.exports = router; 