const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reservationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120, // Dakika cinsinden (2 saat)
    validate: {
      min: 30,
      max: 480 // 8 saat
    }
  },
  guestCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'pending'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  source: {
    type: DataTypes.ENUM('phone', 'web', 'walk_in', 'third_party'),
    defaultValue: 'web'
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tables',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Rezervasyonu alan personel'
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeCreate: async (reservation) => {
      // Rezervasyon numarası oluştur: YYYYMMDD-XXXX (X: Random 4 basamak)
      const date = new Date(reservation.date);
      const dateStr = date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');
      
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      reservation.reservationNumber = `${dateStr}-${randomNum}`;
    }
  }
});

// Instance methods
Reservation.prototype.getEndTime = function() {
  const startTime = new Date(`${this.date}T${this.time}`);
  return new Date(startTime.getTime() + this.duration * 60000);
};

Reservation.prototype.isOverlapping = async function(tableId, date, time, duration) {
  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const overlappingReservations = await Reservation.findAll({
    where: {
      tableId,
      date,
      status: {
        [sequelize.Op.notIn]: ['cancelled', 'no_show']
      },
      id: {
        [sequelize.Op.ne]: this.id // Kendi ID'sini hariç tut (güncelleme durumu için)
      }
    }
  });

  for (const reservation of overlappingReservations) {
    const resStartTime = new Date(`${reservation.date}T${reservation.time}`);
    const resEndTime = reservation.getEndTime();

    if (
      (startTime >= resStartTime && startTime < resEndTime) || // Başlangıç zamanı çakışması
      (endTime > resStartTime && endTime <= resEndTime) || // Bitiş zamanı çakışması
      (startTime <= resStartTime && endTime >= resEndTime) // Kapsama durumu
    ) {
      return true;
    }
  }

  return false;
};

Reservation.prototype.updateStatus = async function(newStatus) {
  const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Geçersiz rezervasyon durumu');
  }

  // Masa durumunu güncelle
  const Table = sequelize.models.Table;
  const table = await Table.findByPk(this.tableId);

  if (table) {
    if (newStatus === 'seated') {
      await table.updateStatus('occupied');
    } else if (['completed', 'cancelled', 'no_show'].includes(newStatus)) {
      // Masada başka aktif rezervasyon var mı kontrol et
      const activeReservations = await Reservation.count({
        where: {
          tableId: this.tableId,
          status: {
            [sequelize.Op.notIn]: ['completed', 'cancelled', 'no_show']
          },
          id: {
            [sequelize.Op.ne]: this.id
          }
        }
      });

      if (activeReservations === 0) {
        await table.updateStatus('available');
      }
    }
  }

  this.status = newStatus;
  await this.save();
};

// Class methods
Reservation.findAvailableTables = async function(date, time, duration, guestCount) {
  const Table = sequelize.models.Table;
  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  // Uygun kapasitedeki tüm masaları bul
  const tables = await Table.findAll({
    where: {
      capacity: {
        [sequelize.Op.gte]: guestCount
      },
      isActive: true
    }
  });

  // Her masa için rezervasyon çakışması kontrol et
  const availableTables = [];
  for (const table of tables) {
    const overlappingReservations = await Reservation.findAll({
      where: {
        tableId: table.id,
        date,
        status: {
          [sequelize.Op.notIn]: ['cancelled', 'no_show']
        }
      }
    });

    let isAvailable = true;
    for (const reservation of overlappingReservations) {
      const resStartTime = new Date(`${reservation.date}T${reservation.time}`);
      const resEndTime = reservation.getEndTime();

      if (
        (startTime >= resStartTime && startTime < resEndTime) ||
        (endTime > resStartTime && endTime <= resEndTime) ||
        (startTime <= resStartTime && endTime >= resEndTime)
      ) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      availableTables.push(table);
    }
  }

  return availableTables;
};

module.exports = Reservation; 