const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
  assignWaiter
} = require('../controllers/tableController');

// Validation middleware
const tableValidation = [
  body('number')
    .isInt({ min: 1 })
    .withMessage('Masa numarası 1\'den büyük bir tam sayı olmalıdır'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Masa kapasitesi 1\'den büyük bir tam sayı olmalıdır'),
  body('section')
    .trim()
    .notEmpty()
    .withMessage('Masa bölümü zorunludur')
];

const statusValidation = [
  body('status')
    .isIn(['empty', 'occupied', 'reserved', 'cleaning'])
    .withMessage('Geçersiz masa durumu')
];

// Routes
router.get('/', auth, getTables);
router.get('/:id', auth, getTableById);
router.post('/', [auth, authorize('admin'), ...tableValidation], createTable);
router.put('/:id', [auth, authorize('admin'), ...tableValidation], updateTable);
router.delete('/:id', [auth, authorize('admin')], deleteTable);
router.patch('/:id/status', [auth, ...statusValidation], updateTableStatus);
router.patch('/:id/assign', [auth, authorize('admin', 'waiter')], assignWaiter);

module.exports = router; 