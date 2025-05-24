const express = require('express');
const router = express.Router();

// Geçici olarak boş rotalar
router.get('/daily', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/monthly', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/sales', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/products', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/waiters', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router; 