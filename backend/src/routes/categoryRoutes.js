const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/categoryController');

// Validation middleware
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Kategori adı en az 2 karakter olmalıdır'),
  body('description')
    .optional()
    .trim(),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Geçersiz üst kategori ID'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sıralama değeri 0 veya daha büyük olmalıdır'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Geçersiz renk kodu (örn: #FF0000)'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Geçersiz resim URL')
];

const reorderValidation = [
  body('categories')
    .isArray()
    .withMessage('Kategoriler listesi gereklidir')
    .notEmpty()
    .withMessage('Kategoriler listesi boş olamaz'),
  body('categories.*.id')
    .isMongoId()
    .withMessage('Geçersiz kategori ID'),
  body('categories.*.order')
    .isInt({ min: 0 })
    .withMessage('Sıralama değeri 0 veya daha büyük olmalıdır')
];

// Routes
router.get('/', auth, getCategories);
router.get('/:id', auth, getCategoryById);
router.post('/', [auth, authorize('admin'), ...categoryValidation], createCategory);
router.put('/:id', [auth, authorize('admin'), ...categoryValidation], updateCategory);
router.delete('/:id', [auth, authorize('admin')], deleteCategory);
router.patch('/reorder', [auth, authorize('admin'), ...reorderValidation], reorderCategories);

module.exports = router; 