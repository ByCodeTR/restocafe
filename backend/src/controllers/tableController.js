const Table = require('../models/Table');
const User = require('../models/User');
const { ValidationError } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');
const socketService = require('../services/socketService');
const tableService = require('../services/tableService');
const catchAsync = require('../utils/catchAsync');
const { validateTableData } = require('../validations/tableValidation');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
exports.getAllTables = async (req, res) => {
  const { status, location } = req.query;
  const where = {};
  
  if (status) where.status = status;
  if (location) where.location = location;

  const tables = await Table.findAll({
    where,
    include: [{
      model: User,
      as: 'currentWaiter',
      attributes: ['id', 'name']
    }],
    order: [['number', 'ASC']]
  });

  res.json(tables);
};

// @desc    Get table by ID
// @route   GET /api/tables/:id
// @access  Private
exports.getTableById = async (req, res) => {
  const table = await Table.findByPk(req.params.id, {
    include: [{
      model: User,
      as: 'currentWaiter',
      attributes: ['id', 'name']
    }]
  });

  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  res.json(table);
};

// @desc    Get table by QR
// @route   GET /api/tables/qr/:qrCode
// @access  Private
exports.getTableByQR = async (req, res) => {
  const table = await Table.findOne({
    where: { qrCode: req.params.qrCode },
    include: [{
      model: User,
      as: 'currentWaiter',
      attributes: ['id', 'name']
    }]
  });

  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  res.json(table);
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private (Admin only)
exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);

    // İlişkili verileri içeren masayı döndür
    const tableWithRelations = await Table.findByPk(table.id, {
      include: [{
        model: User,
        as: 'currentWaiter',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json(tableWithRelations);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz masa bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private (Admin only)
exports.updateTable = async (req, res) => {
  const table = await Table.findByPk(req.params.id);
  
  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  try {
    await table.update(req.body);

    // İlişkili verileri içeren güncel masayı döndür
    const updatedTable = await Table.findByPk(table.id, {
      include: [{
        model: User,
        as: 'currentWaiter',
        attributes: ['id', 'name']
      }]
    });

    res.json(updatedTable);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz masa bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (Admin only)
exports.deleteTable = async (req, res) => {
  const table = await Table.findByPk(req.params.id);
  
  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  await table.destroy();
  res.status(204).send();
};

// @desc    Update table status
// @route   PATCH /api/tables/:id/status
// @access  Private
exports.updateTableStatus = async (req, res) => {
  const { status } = req.body;
  const table = await Table.findByPk(req.params.id);
  
  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  try {
    await table.updateStatus(status);

    // Gerçek zamanlı bildirim gönder
    socketService.notifyTableStatusUpdate(table.id, status, req.user.id);

    res.json(table);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Assign waiter to table
// @route   PATCH /api/tables/:id/assign
// @access  Private (Admin, Manager only)
exports.assignWaiter = async (req, res) => {
  const { waiterId } = req.body;
  const table = await Table.findByPk(req.params.id);
  
  if (!table) {
    throw new ApiError(404, 'Masa bulunamadı');
  }

  // Garson kontrolü
  const waiter = await User.findOne({
    where: {
      id: waiterId,
      roles: {
        [Op.contains]: ['waiter']
      }
    }
  });

  if (!waiter) {
    throw new ApiError(400, 'Garson bulunamadı');
  }

  try {
    table.currentWaiterId = waiterId;
    await table.save();

    // İlişkili verileri içeren güncel masayı döndür
    const updatedTable = await Table.findByPk(table.id, {
      include: [{
        model: User,
        as: 'currentWaiter',
        attributes: ['id', 'name']
      }]
    });

    // Gerçek zamanlı bildirim gönder
    socketService.notifyTableAssigned(table.id, waiterId);

    res.json(updatedTable);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Get available tables
// @route   GET /api/tables/available
// @access  Private
exports.getAvailableTables = async (req, res) => {
  const { capacity, location } = req.query;
  const where = {
    status: 'available',
    isActive: true
  };

  if (capacity) where.capacity = { [Op.gte]: parseInt(capacity) };
  if (location) where.location = location;

  const tables = await Table.findAll({
    where,
    order: [['number', 'ASC']]
  });

  res.json(tables);
};

const tableController = {
  /**
   * GET /api/tables
   * Tüm masaları listele
   */
  getTables: catchAsync(async (req, res) => {
    const filters = {
      status: req.query.status,
      section: req.query.section,
      floor: req.query.floor ? parseInt(req.query.floor) : undefined,
      capacity: req.query.capacity ? parseInt(req.query.capacity) : undefined,
      waiterId: req.query.waiterId ? parseInt(req.query.waiterId) : undefined
    };

    const tables = await tableService.getTables(filters);
    res.json(tables);
  }),

  /**
   * GET /api/tables/:id
   * Masa detayını getir
   */
  getTableById: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const table = await tableService.getTableById(tableId);
    res.json(table);
  }),

  /**
   * POST /api/tables
   * Yeni masa oluştur
   */
  createTable: catchAsync(async (req, res) => {
    const tableData = await validateTableData(req.body);
    const table = await tableService.createTable(tableData);
    res.status(201).json(table);
  }),

  /**
   * PUT /api/tables/:id
   * Masa güncelle
   */
  updateTable: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const updateData = await validateTableData(req.body, true);
    const table = await tableService.updateTable(tableId, updateData);
    res.json(table);
  }),

  /**
   * DELETE /api/tables/:id
   * Masa sil
   */
  deleteTable: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    await tableService.deleteTable(tableId);
    res.status(204).send();
  }),

  /**
   * PATCH /api/tables/:id/status
   * Masa durumunu güncelle
   */
  updateTableStatus: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const { status, waiterId } = req.body;

    if (!status) {
      throw new ApiError(400, 'Durum belirtilmedi');
    }

    const table = await tableService.updateTableStatus(
      tableId,
      status,
      waiterId ? parseInt(waiterId) : null
    );
    res.json(table);
  }),

  /**
   * POST /api/tables/:id/waiter
   * Masaya garson ata
   */
  assignWaiter: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const { waiterId } = req.body;

    if (!waiterId) {
      throw new ApiError(400, 'Garson ID belirtilmedi');
    }

    const table = await tableService.assignWaiter(tableId, parseInt(waiterId));
    res.json(table);
  }),

  /**
   * DELETE /api/tables/:id/waiter
   * Masadan garson kaldır
   */
  removeWaiter: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const table = await tableService.removeWaiter(tableId);
    res.json(table);
  }),

  /**
   * POST /api/tables/:id/qr-code
   * Yeni QR kod oluştur
   */
  regenerateQRCode: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const qrCode = await tableService.regenerateQRCode(tableId);
    res.json({ qrCode });
  }),

  /**
   * POST /api/tables/:id/verify-qr
   * QR kod doğrula
   */
  verifyQRCode: catchAsync(async (req, res) => {
    const tableId = parseInt(req.params.id);
    const { secret } = req.body;

    if (!secret) {
      throw new ApiError(400, 'QR kod secret belirtilmedi');
    }

    const isValid = await tableService.verifyQRCode(tableId, secret);
    res.json({ isValid });
  }),

  /**
   * GET /api/tables/available
   * Müsait masaları getir
   */
  getAvailableTables: catchAsync(async (req, res) => {
    const filters = {
      capacity: req.query.capacity ? parseInt(req.query.capacity) : undefined,
      section: req.query.section,
      floor: req.query.floor ? parseInt(req.query.floor) : undefined
    };

    const tables = await tableService.getAvailableTables(filters);
    res.json(tables);
  })
};

module.exports = tableController; 