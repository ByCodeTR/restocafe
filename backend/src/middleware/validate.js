const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Express-validator sonuçlarını kontrol eden middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));

    return next(new ApiError(400, 'Validation error', validationErrors));
  }
  next();
};

module.exports = validate; 