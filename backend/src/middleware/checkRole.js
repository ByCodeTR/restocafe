const ApiError = require('../utils/ApiError');

/**
 * Rol kontrolü middleware'i
 * @param {string[]} roles - İzin verilen roller
 * @returns {Function} Express middleware
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Yetkilendirme gerekli'));
    }

    const hasRequiredRole = req.user.hasAnyRole(roles);

    if (!hasRequiredRole) {
      return next(new ApiError(403, 'Bu işlem için yetkiniz yok'));
    }

    next();
  };
};

module.exports = checkRole; 