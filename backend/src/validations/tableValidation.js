const Joi = require('joi');
const ApiError = require('../utils/ApiError');

const tableSchema = Joi.object({
  number: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'Masa numarası sayı olmalıdır',
      'number.integer': 'Masa numarası tam sayı olmalıdır',
      'number.min': 'Masa numarası en az 1 olmalıdır',
      'any.required': 'Masa numarası zorunludur'
    }),

  name: Joi.string().min(1).max(50).required()
    .messages({
      'string.base': 'Masa adı metin olmalıdır',
      'string.empty': 'Masa adı boş olamaz',
      'string.min': 'Masa adı en az 1 karakter olmalıdır',
      'string.max': 'Masa adı en fazla 50 karakter olmalıdır',
      'any.required': 'Masa adı zorunludur'
    }),

  capacity: Joi.number().integer().min(1).max(20).required()
    .messages({
      'number.base': 'Kapasite sayı olmalıdır',
      'number.integer': 'Kapasite tam sayı olmalıdır',
      'number.min': 'Kapasite en az 1 olmalıdır',
      'number.max': 'Kapasite en fazla 20 olmalıdır',
      'any.required': 'Kapasite zorunludur'
    }),

  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance')
    .default('available')
    .messages({
      'string.base': 'Durum metin olmalıdır',
      'any.only': 'Geçersiz masa durumu'
    }),

  section: Joi.string().min(1).max(50).allow(null)
    .messages({
      'string.base': 'Bölüm metin olmalıdır',
      'string.min': 'Bölüm adı en az 1 karakter olmalıdır',
      'string.max': 'Bölüm adı en fazla 50 karakter olmalıdır'
    }),

  floor: Joi.number().integer().min(0).allow(null)
    .messages({
      'number.base': 'Kat sayı olmalıdır',
      'number.integer': 'Kat tam sayı olmalıdır',
      'number.min': 'Kat en az 0 olmalıdır'
    }),

  isActive: Joi.boolean().default(true)
    .messages({
      'boolean.base': 'Aktiflik durumu boolean olmalıdır'
    })
});

const updateTableSchema = tableSchema.fork(
  ['number', 'name', 'capacity'],
  (schema) => schema.optional()
);

/**
 * Masa verilerini doğrula
 * @param {Object} data - Doğrulanacak veriler
 * @param {boolean} isUpdate - Güncelleme işlemi mi?
 * @returns {Promise<Object>} - Doğrulanmış veriler
 * @throws {ApiError} - Doğrulama hatası
 */
const validateTableData = async (data, isUpdate = false) => {
  try {
    const schema = isUpdate ? updateTableSchema : tableSchema;
    return await schema.validateAsync(data, { abortEarly: false });
  } catch (error) {
    if (error.isJoi) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      throw new ApiError(400, 'Doğrulama hatası', errors);
    }
    throw error;
  }
};

module.exports = {
  validateTableData
}; 