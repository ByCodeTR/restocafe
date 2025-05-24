const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const config = require('../config');
const authService = require('../services/authService');
const ApiError = require('../utils/ApiError');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

/**
 * @desc    Kullanıcı girişi
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Yeni kullanıcı kaydı
 * @route   POST /api/auth/register
 * @access  Private (Admin only)
 */
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const userData = {
      ...req.body,
      currentUser: req.user // Admin kontrolü için
    };

    const { user, token } = await authService.register(userData);

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Şifre sıfırlama talebi
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    await authService.forgotPassword(req.body.email);

    res.json({
      status: 'success',
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Şifre sıfırlama
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res.json({
      status: 'success',
      message: 'Şifreniz başarıyla güncellendi'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Şifre değiştirme
 * @route   POST /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user, currentPassword, newPassword);

    res.json({
      status: 'success',
      message: 'Şifreniz başarıyla güncellendi'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Profil güncelleme
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const updatedUser = await authService.updateProfile(req.user, req.body);

    res.json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Kullanıcı durumunu değiştirme
 * @route   PATCH /api/auth/users/:id/status
 * @access  Private (Admin only)
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await authService.toggleUserStatus(id, isActive);

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Kullanıcı rollerini güncelleme
 * @route   PATCH /api/auth/users/:id/roles
 * @access  Private (Admin only)
 */
exports.updateUserRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    const user = await authService.updateUserRoles(id, roles, req.user);

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mevcut kullanıcı bilgilerini getir
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
}; 