const Table = require('../models/Table');
const { validationResult } = require('express-validator');
const QRCode = require('qrcode');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate('currentWaiter', 'username fullName')
      .populate('currentOrder', 'status totalAmount');
    
    res.json(tables);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Get table by ID
// @route   GET /api/tables/:id
// @access  Private
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .populate('currentWaiter', 'username fullName')
      .populate('currentOrder', 'status totalAmount');

    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }

    res.json(table);
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private (Admin only)
exports.createTable = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number, capacity, section } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ message: 'Bu masa numarası zaten kullanımda' });
    }

    // Generate QR code
    const qrData = JSON.stringify({
      tableNumber: number,
      section: section
    });
    
    const qrCode = await QRCode.toDataURL(qrData);

    const table = new Table({
      number,
      capacity,
      section,
      qrCode
    });

    await table.save();

    res.status(201).json({
      message: 'Masa başarıyla oluşturuldu',
      table
    });
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private (Admin only)
exports.updateTable = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number, capacity, section, isActive } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }

    // Check if new table number already exists
    if (number && number !== table.number) {
      const existingTable = await Table.findOne({ number });
      if (existingTable) {
        return res.status(400).json({ message: 'Bu masa numarası zaten kullanımda' });
      }
      table.number = number;
    }

    if (capacity) table.capacity = capacity;
    if (section) table.section = section;
    if (typeof isActive === 'boolean') table.isActive = isActive;

    // Update QR code if table number or section changed
    if (number || section) {
      const qrData = JSON.stringify({
        tableNumber: number || table.number,
        section: section || table.section
      });
      table.qrCode = await QRCode.toDataURL(qrData);
    }

    await table.save();

    res.json({
      message: 'Masa başarıyla güncellendi',
      table
    });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (Admin only)
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }

    if (table.status !== 'empty') {
      return res.status(400).json({ message: 'Dolu veya rezerve masa silinemez' });
    }

    await table.remove();

    res.json({ message: 'Masa başarıyla silindi' });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update table status
// @route   PATCH /api/tables/:id/status
// @access  Private
exports.updateTableStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }

    // Only allow status change if table is active
    if (!table.isActive) {
      return res.status(400).json({ message: 'Pasif masa durumu değiştirilemez' });
    }

    table.status = status;

    // Clear waiter assignment if table becomes empty
    if (status === 'empty') {
      table.currentWaiter = null;
      table.currentOrder = null;
    }

    // Assign waiter if table becomes occupied and no waiter assigned
    if (status === 'occupied' && !table.currentWaiter) {
      table.currentWaiter = req.user._id;
    }

    await table.save();

    // Populate the response
    await table.populate('currentWaiter', 'username fullName');
    await table.populate('currentOrder', 'status totalAmount');

    // Emit socket event for real-time updates
    req.io.emit('table_status_changed', {
      tableId: table._id,
      status: table.status,
      currentWaiter: table.currentWaiter
    });

    res.json({
      message: 'Masa durumu güncellendi',
      table
    });
  } catch (error) {
    console.error('Update table status error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Assign waiter to table
// @route   PATCH /api/tables/:id/assign
// @access  Private (Admin & Waiter)
exports.assignWaiter = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }

    // Only allow assignment if table is active
    if (!table.isActive) {
      return res.status(400).json({ message: 'Pasif masaya garson atanamaz' });
    }

    table.currentWaiter = req.user._id;
    await table.save();

    // Populate the response
    await table.populate('currentWaiter', 'username fullName');

    // Emit socket event for real-time updates
    req.io.emit('table_waiter_assigned', {
      tableId: table._id,
      waiter: table.currentWaiter
    });

    res.json({
      message: 'Garson ataması yapıldı',
      table
    });
  } catch (error) {
    console.error('Assign waiter error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 