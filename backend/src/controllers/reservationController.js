const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const User = require('../models/User');
const { ValidationError, Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const socketService = require('../services/socketService');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
exports.getAllReservations = async (req, res) => {
  const {
    status,
    tableId,
    userId,
    customerId,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'ASC'
  } = req.query;

  // Filtreleme koşulları
  const where = {};
  
  if (status) where.status = status;
  if (tableId) where.tableId = tableId;
  if (userId) where.userId = userId;
  if (customerId) where.customerId = customerId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  // Sayfalama
  const offset = (page - 1) * limit;
  
  // Sıralama
  const order = [[sortBy, sortOrder]];

  const { count, rows: reservations } = await Reservation.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'staff',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Table,
        attributes: ['id', 'number', 'capacity']
      }
    ],
    order,
    offset,
    limit: parseInt(limit)
  });

  res.json({
    reservations,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    totalItems: count
  });
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'staff',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Table,
        attributes: ['id', 'number', 'capacity']
      }
    ]
  });

  if (!reservation) {
    throw new ApiError(404, 'Rezervasyon bulunamadı');
  }

  res.json(reservation);
};

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      duration,
      guestCount,
      note,
      specialRequests,
      source,
      tableId,
      customerId
    } = req.body;

    // Masa kontrolü
    const table = await Table.findByPk(tableId);
    if (!table) {
      throw new ApiError(400, 'Masa bulunamadı');
    }

    // Kapasite kontrolü
    if (table.capacity < guestCount) {
      throw new ApiError(400, 'Masa kapasitesi yetersiz');
    }

    // Müşteri kontrolü
    if (customerId) {
      const customer = await User.findByPk(customerId);
      if (!customer) {
        throw new ApiError(400, 'Müşteri bulunamadı');
      }
    }

    // Çakışma kontrolü
    const reservation = Reservation.build({
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      duration,
      guestCount,
      note,
      specialRequests,
      source,
      tableId,
      userId: req.user.id,
      customerId
    });

    const isOverlapping = await reservation.isOverlapping(tableId, date, time, duration);
    if (isOverlapping) {
      throw new ApiError(400, 'Seçilen masa ve zaman dilimi için başka bir rezervasyon bulunmakta');
    }

    await reservation.save();

    // İlişkili verileri içeren rezervasyonu döndür
    const reservationWithRelations = await Reservation.findByPk(reservation.id, {
      include: [
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'name']
        },
        {
          model: Table,
          attributes: ['id', 'number', 'capacity']
        }
      ]
    });

    // Gerçek zamanlı bildirim gönder
    socketService.notifyNewReservation(reservationWithRelations);

    res.status(201).json(reservationWithRelations);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz rezervasyon bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  
  if (!reservation) {
    throw new ApiError(404, 'Rezervasyon bulunamadı');
  }

  // Sadece bekleyen veya onaylanmış rezervasyonlar güncellenebilir
  if (!['pending', 'confirmed'].includes(reservation.status)) {
    throw new ApiError(400, 'Sadece bekleyen veya onaylanmış rezervasyonlar güncellenebilir');
  }

  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      duration,
      guestCount,
      note,
      specialRequests,
      tableId
    } = req.body;

    // Masa değişikliği varsa kontroller yapılır
    if (tableId && tableId !== reservation.tableId) {
      const table = await Table.findByPk(tableId);
      if (!table) {
        throw new ApiError(400, 'Masa bulunamadı');
      }

      if (table.capacity < guestCount) {
        throw new ApiError(400, 'Masa kapasitesi yetersiz');
      }

      // Çakışma kontrolü
      const isOverlapping = await reservation.isOverlapping(tableId, date || reservation.date, time || reservation.time, duration || reservation.duration);
      if (isOverlapping) {
        throw new ApiError(400, 'Seçilen masa ve zaman dilimi için başka bir rezervasyon bulunmakta');
      }
    }

    // Rezervasyonu güncelle
    await reservation.update({
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      duration,
      guestCount,
      note,
      specialRequests,
      tableId
    });

    // İlişkili verileri içeren güncel rezervasyonu döndür
    const updatedReservation = await Reservation.findByPk(reservation.id, {
      include: [
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'name']
        },
        {
          model: Table,
          attributes: ['id', 'number', 'capacity']
        }
      ]
    });

    // Gerçek zamanlı bildirim gönder
    socketService.notifyReservationStatusUpdate(updatedReservation);

    res.json(updatedReservation);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz rezervasyon bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  
  if (!reservation) {
    throw new ApiError(404, 'Rezervasyon bulunamadı');
  }

  // Sadece bekleyen veya onaylanmış rezervasyonlar silinebilir
  if (!['pending', 'confirmed'].includes(reservation.status)) {
    throw new ApiError(400, 'Sadece bekleyen veya onaylanmış rezervasyonlar silinebilir');
  }

  // Gerçek zamanlı bildirim gönder
  socketService.notifyReservationCancelled(reservation);

  await reservation.destroy();
  res.status(204).send();
};

// @desc    Update reservation status
// @route   PATCH /api/reservations/:id/status
// @access  Private
exports.updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findByPk(req.params.id);
  
  if (!reservation) {
    throw new ApiError(404, 'Rezervasyon bulunamadı');
  }

  try {
    await reservation.updateStatus(status);

    // Gerçek zamanlı bildirim gönder
    socketService.notifyReservationStatusUpdate(reservation);

    res.json(reservation);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Find available tables
// @route   GET /api/reservations/available-tables
// @access  Private
exports.findAvailableTables = async (req, res) => {
  const { date, time, duration, guestCount } = req.query;

  if (!date || !time || !duration || !guestCount) {
    throw new ApiError(400, 'Tarih, saat, süre ve misafir sayısı zorunludur');
  }

  const availableTables = await Reservation.findAvailableTables(
    date,
    time,
    parseInt(duration),
    parseInt(guestCount)
  );

  res.json(availableTables);
}; 