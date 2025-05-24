const Customer = require('../models/Customer');
const { startOfDay, endOfDay, subMonths } = require('date-fns');

// Müşterileri listele
exports.getCustomers = async (req, res) => {
  try {
    const { search, membershipTier, status, sort = '-createdAt' } = req.query;
    const query = {};

    // Arama filtresi
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Üyelik seviyesi filtresi
    if (membershipTier) {
      query.membershipTier = membershipTier;
    }

    // Durum filtresi
    if (status) {
      query.status = status;
    }

    const customers = await Customer.find(query)
      .sort(sort)
      .populate('preferences.favoriteTable', 'number capacity');

    res.json({ customers });
  } catch (error) {
    res.status(500).json({
      message: 'Müşteriler alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Müşteri detayı
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('preferences.favoriteTable', 'number capacity')
      .populate({
        path: 'reservations',
        options: { sort: { time: -1 }, limit: 5 }
      })
      .populate({
        path: 'orders',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });

    if (!customer) {
      return res.status(404).json({
        message: 'Müşteri bulunamadı'
      });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({
      message: 'Müşteri alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni müşteri oluştur
exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      contactPreferences,
      notes,
      dietaryRestrictions,
      preferences
    } = req.body;

    // Telefon veya e-posta ile müşteri kontrolü
    if (phone || email) {
      const existingCustomer = await Customer.findByContact(phone || email);
      if (existingCustomer) {
        return res.status(400).json({
          message: 'Bu telefon veya e-posta ile kayıtlı müşteri bulunmaktadır'
        });
      }
    }

    const customer = new Customer({
      name,
      phone,
      email,
      contactPreferences,
      notes,
      dietaryRestrictions,
      preferences,
      createdBy: req.user._id
    });

    await customer.save();

    res.status(201).json({
      message: 'Müşteri başarıyla oluşturuldu',
      customer
    });
  } catch (error) {
    res.status(500).json({
      message: 'Müşteri oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Müşteri güncelle
exports.updateCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      contactPreferences,
      notes,
      dietaryRestrictions,
      preferences,
      status
    } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        message: 'Müşteri bulunamadı'
      });
    }

    // Telefon veya e-posta değişikliği varsa kontrol
    if ((phone && phone !== customer.phone) || (email && email !== customer.email)) {
      const existingCustomer = await Customer.findByContact(phone || email);
      if (existingCustomer && existingCustomer._id.toString() !== customer._id.toString()) {
        return res.status(400).json({
          message: 'Bu telefon veya e-posta ile kayıtlı başka bir müşteri bulunmaktadır'
        });
      }
    }

    // Alanları güncelle
    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (email) customer.email = email;
    if (contactPreferences) customer.contactPreferences = contactPreferences;
    if (notes) customer.notes = notes;
    if (dietaryRestrictions) customer.dietaryRestrictions = dietaryRestrictions;
    if (preferences) customer.preferences = { ...customer.preferences, ...preferences };
    if (status) customer.status = status;

    customer.updatedBy = req.user._id;
    await customer.save();

    res.json({
      message: 'Müşteri başarıyla güncellendi',
      customer
    });
  } catch (error) {
    res.status(500).json({
      message: 'Müşteri güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Müşteri istatistikleri
exports.getCustomerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        message: 'Müşteri bulunamadı'
      });
    }

    // Son 6 aylık rezervasyon ve sipariş istatistikleri
    const sixMonthsAgo = subMonths(new Date(), 6);
    
    const reservations = await customer.populate({
      path: 'reservations',
      match: { time: { $gte: sixMonthsAgo } },
      select: 'time status partySize'
    });

    const orders = await customer.populate({
      path: 'orders',
      match: { createdAt: { $gte: sixMonthsAgo } },
      select: 'total items.quantity items.product'
    });

    const stats = {
      ...customer.stats,
      recentReservations: reservations.reservations,
      recentOrders: orders.orders,
      loyaltyProgress: {
        currentTier: customer.membershipTier,
        points: customer.loyaltyPoints,
        nextTier: customer.membershipTier === 'platinum' ? null : {
          name: getNextTier(customer.membershipTier),
          pointsNeeded: getPointsForNextTier(customer.membershipTier) - customer.loyaltyPoints
        }
      }
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      message: 'Müşteri istatistikleri alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yardımcı fonksiyonlar
const getNextTier = (currentTier) => {
  const tiers = {
    'bronze': 'silver',
    'silver': 'gold',
    'gold': 'platinum'
  };
  return tiers[currentTier];
};

const getPointsForNextTier = (currentTier) => {
  const points = {
    'bronze': 200,  // Silver için gereken puan
    'silver': 500,  // Gold için gereken puan
    'gold': 1000    // Platinum için gereken puan
  };
  return points[currentTier];
}; 