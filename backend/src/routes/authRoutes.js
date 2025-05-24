const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Kullanıcı adı en az 3 karakter olmalıdır'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Ad Soyad alanı zorunludur'),
  body('role')
    .isIn(['admin', 'waiter', 'kitchen', 'cashier'])
    .withMessage('Geçersiz rol')
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Kullanıcı adı zorunludur'),
  body('password').notEmpty().withMessage('Şifre zorunludur')
];

const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Ad Soyad alanı boş olamaz'),
  body('currentPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Mevcut şifre en az 6 karakter olmalıdır'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

// Routes
router.post('/register', [auth, authorize('admin'), ...registerValidation], register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getProfile);
router.put('/profile', [auth, ...updateProfileValidation], updateProfile);

// Temporary route handlers
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get current user endpoint' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile endpoint' });
});

module.exports = router; 