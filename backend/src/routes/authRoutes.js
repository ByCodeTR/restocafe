const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation kuralları
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Kullanıcı adı en az 3 karakter olmalıdır'),
  body('email')
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Ad alanı zorunludur'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Soyad alanı zorunludur'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'waiter', 'kitchen', 'cashier'])
    .withMessage('Geçersiz rol')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz'),
  body('password')
    .notEmpty()
    .withMessage('Şifre alanı zorunludur')
];

const updateProfileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz'),
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Ad alanı boş olamaz'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Soyad alanı boş olamaz'),
  body('currentPassword')
    .if(body('newPassword').exists())
    .notEmpty()
    .withMessage('Mevcut şifre gereklidir'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', protect, authController.getProfile);
router.put('/profile', protect, updateProfileValidation, authController.updateProfile);

module.exports = router; 