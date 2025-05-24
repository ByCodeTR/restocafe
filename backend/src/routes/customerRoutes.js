const express = require('express');
const router = express.Router();

// Geçici olarak boş rotalar
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router; 