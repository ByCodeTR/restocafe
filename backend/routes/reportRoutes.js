const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/authMiddleware');
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  generateQuickReport,
  refreshReport
} = require('../controllers/reportController');

// Tüm rotalar için auth middleware'i
router.use(auth);

// Rapor Listesi (Admin ve Manager)
router.get('/', checkRole(['admin', 'manager']), getReports);

// Rapor Detayı (Admin ve Manager)
router.get('/:id', checkRole(['admin', 'manager']), getReport);

// Yeni Rapor Oluştur (Admin)
router.post('/', checkRole(['admin']), createReport);

// Rapor Güncelle (Admin)
router.patch('/:id', checkRole(['admin']), updateReport);

// Rapor Sil (Admin)
router.delete('/:id', checkRole(['admin']), deleteReport);

// Hızlı Rapor Oluştur (Admin ve Manager)
router.post('/quick', checkRole(['admin', 'manager']), generateQuickReport);

// Rapor Önbelleğini Yenile (Admin ve Manager)
router.post('/:id/refresh', checkRole(['admin', 'manager']), refreshReport);

module.exports = router; 