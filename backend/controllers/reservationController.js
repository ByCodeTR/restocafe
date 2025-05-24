const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { startOfDay, endOfDay, addHours, parseISO } = require('date-fns');
const { sendReservationConfirmation, sendReservationCancellation } = require('../services/emailService');
const socketService = require('../services/socketService');

// Rezervasyonları listele
exports.getReservations = async (req, res) => {
  try {
    const { date, status, search } = req.query;
    const query = {};

    // Tarih filtresi
    if (date) {
      const start = startOfDay(parseISO(date));
      const end = endOfDay(parseISO(date));
      query.time = { $gte: start, $lte: end };
    }

    // Durum filtresi
    if (status) {
      query.status = status;
    }

    // Arama filtresi
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const reservations = await Reservation.find(query)
      .populate('table', 'number capacity')
      .populate('createdBy', 'name')
      .sort({ time: 1 });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({
      message: 'Rezervasyonlar alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Rezervasyon detayı
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('table', 'number capacity')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .populate('cancelledBy', 'name');

    if (!reservation) {
      return res.status(404).json({
        message: 'Rezervasyon bulunamadı'
      });
    }

    res.json({ reservation });
  } catch (error) {
    res.status(500).json({
      message: 'Rezervasyon alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni rezervasyon oluştur
exports.createReservation = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      tableId,
      time,
      partySize,
      notes
    } = req.body;

    // Masa kontrolü
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        message: 'Masa bulunamadı'
      });
    }

    // Kapasite kontrolü
    if (partySize > table.capacity) {
      return res.status(400).json({
        message: 'Seçilen masa kapasitesi yetersiz'
      });
    }

    // Çakışma kontrolü
    const conflicts = await Reservation.findConflicts(tableId, time);
    if (conflicts.length > 0) {
      return res.status(400).json({
        message: 'Bu masa için seçilen saatte başka bir rezervasyon bulunmaktadır'
      });
    }

    const reservation = new Reservation({
      customerName,
      customerPhone,
      customerEmail,
      table: tableId,
      time,
      partySize,
      notes,
      createdBy: req.user._id
    });

    await reservation.save();

    // Rezervasyon bilgilerini doldur
    await reservation.populate([
      { path: 'table', select: 'number capacity' },
      { path: 'createdBy', select: 'name' }
    ]);

    // Socket.io bildirimi
    socketService.emitToRoom('reservations', 'newReservation', {
      reservation
    });

    // E-posta bildirimi
    if (customerEmail) {
      await sendReservationConfirmation(reservation);
    }

    res.status(201).json({
      message: 'Rezervasyon başarıyla oluşturuldu',
      reservation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rezervasyon oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Rezervasyon güncelle
exports.updateReservation = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      tableId,
      time,
      partySize,
      notes,
      status
    } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        message: 'Rezervasyon bulunamadı'
      });
    }

    // İptal edilmiş rezervasyon güncellenemez
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        message: 'İptal edilmiş rezervasyon güncellenemez'
      });
    }

    // Masa değişikliği varsa kontroller
    if (tableId && tableId !== reservation.table.toString()) {
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({
          message: 'Masa bulunamadı'
        });
      }

      // Kapasite kontrolü
      if (partySize > table.capacity) {
        return res.status(400).json({
          message: 'Seçilen masa kapasitesi yetersiz'
        });
      }

      // Çakışma kontrolü
      const conflicts = await Reservation.findConflicts(tableId, time || reservation.time);
      if (conflicts.length > 0) {
        return res.status(400).json({
          message: 'Bu masa için seçilen saatte başka bir rezervasyon bulunmaktadır'
        });
      }

      reservation.table = tableId;
    }

    // Diğer alanları güncelle
    if (customerName) reservation.customerName = customerName;
    if (customerPhone) reservation.customerPhone = customerPhone;
    if (customerEmail) reservation.customerEmail = customerEmail;
    if (time) reservation.time = time;
    if (partySize) reservation.partySize = partySize;
    if (notes) reservation.notes = notes;
    if (status) reservation.status = status;

    reservation.updatedBy = req.user._id;
    await reservation.save();

    // Rezervasyon bilgilerini doldur
    await reservation.populate([
      { path: 'table', select: 'number capacity' },
      { path: 'createdBy', select: 'name' },
      { path: 'updatedBy', select: 'name' }
    ]);

    // Socket.io bildirimi
    socketService.emitToRoom('reservations', 'reservationUpdate', {
      reservation
    });

    res.json({
      message: 'Rezervasyon başarıyla güncellendi',
      reservation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rezervasyon güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Rezervasyon iptal et
exports.cancelReservation = async (req, res) => {
  try {
    const { reason } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: 'Rezervasyon bulunamadı'
      });
    }

    // Zaten iptal edilmiş
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        message: 'Bu rezervasyon zaten iptal edilmiş'
      });
    }

    await reservation.cancel(req.user._id, reason);

    // Rezervasyon bilgilerini doldur
    await reservation.populate([
      { path: 'table', select: 'number capacity' },
      { path: 'cancelledBy', select: 'name' }
    ]);

    // Socket.io bildirimi
    socketService.emitToRoom('reservations', 'reservationCancel', {
      reservation
    });

    // E-posta bildirimi
    if (reservation.customerEmail) {
      await sendReservationCancellation(reservation);
    }

    res.json({
      message: 'Rezervasyon başarıyla iptal edildi',
      reservation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rezervasyon iptal edilirken bir hata oluştu',
      error: error.message
    });
  }
};

// Müsait masaları kontrol et
exports.checkAvailableTables = async (req, res) => {
  try {
    const { date, time, partySize } = req.query;
    const reservationTime = new Date(`${date}T${time}`);

    // Yeterli kapasiteye sahip masaları bul
    const tables = await Table.find({
      capacity: { $gte: parseInt(partySize) },
      status: 'active'
    });

    // Her masa için çakışma kontrolü yap
    const availableTables = [];
    for (const table of tables) {
      const conflicts = await Reservation.findConflicts(table._id, reservationTime);
      if (conflicts.length === 0) {
        availableTables.push(table);
      }
    }

    res.json({ tables: availableTables });
  } catch (error) {
    res.status(500).json({
      message: 'Müsait masalar kontrol edilirken bir hata oluştu',
      error: error.message
    });
  }
}; 