const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const validate = require('../middleware/validate');

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
];

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('firstName')
    .notEmpty()
    .withMessage('Ad alanı gereklidir')
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır'),
  body('lastName')
    .notEmpty()
    .withMessage('Soyad alanı gereklidir')
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır'),
  body('roles')
    .optional()
    .isArray()
    .withMessage('Roller bir dizi olmalıdır')
    .custom(value => {
      const validRoles = ['admin', 'manager', 'waiter', 'kitchen', 'cashier'];
      return value.every(role => validRoles.includes(role));
    })
    .withMessage('Geçersiz rol')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz')
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token gereklidir'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mevcut şifre gereklidir'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır')
];

const toggleUserStatusValidation = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive bir boolean değer olmalıdır')
];

const updateUserRolesValidation = [
  body('roles')
    .isArray()
    .withMessage('Roller bir dizi olmalıdır')
    .custom(value => {
      const validRoles = ['admin', 'manager', 'waiter', 'kitchen', 'cashier'];
      return value.every(role => validRoles.includes(role));
    })
    .withMessage('Geçersiz rol')
];

// Routes
router.post('/login', loginValidation, validate, authController.login);
router.post('/register', auth, checkRole(['admin']), registerValidation, validate, authController.register);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);
router.post('/change-password', auth, changePasswordValidation, validate, authController.changePassword);
router.put('/profile', auth, updateProfileValidation, validate, authController.updateProfile);
router.get('/me', auth, authController.getMe);
router.patch('/users/:id/status', auth, checkRole(['admin']), toggleUserStatusValidation, validate, authController.toggleUserStatus);
router.patch('/users/:id/roles', auth, checkRole(['admin']), updateUserRolesValidation, validate, authController.updateUserRoles);

module.exports = router; 