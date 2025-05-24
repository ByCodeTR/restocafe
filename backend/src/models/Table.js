const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const QRCode = require('qrcode');
const crypto = require('crypto');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 1
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 20
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'),
    allowNull: false,
    defaultValue: 'available'
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  qrCode: {
    type: DataTypes.STRING,
    unique: true
  },
  qrCodeSecret: {
    type: DataTypes.STRING,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastOrderAt: {
    type: DataTypes.DATE
  },
  currentWaiterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (table) => {
      // QR kod için benzersiz bir secret oluştur
      const secret = crypto.randomBytes(32).toString('hex');
      table.qrCodeSecret = secret;
      
      // QR kod URL'ini oluştur ve kaydet
      const qrData = {
        tableId: table.id,
        tableNumber: table.number,
        secret
      };
      
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      table.qrCode = qrCodeUrl;
    }
  }
});

// Instance methods
Table.prototype.isAvailable = function() {
  return this.status === 'available';
};

Table.prototype.isOccupied = function() {
  return this.status === 'occupied';
};

Table.prototype.isReserved = function() {
  return this.status === 'reserved';
};

Table.prototype.canBeReserved = function() {
  return ['available', 'maintenance'].includes(this.status);
};

Table.prototype.updateStatus = async function(newStatus, waiterId = null) {
  const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Geçersiz masa durumu');
  }

  this.status = newStatus;
  
  if (waiterId) {
    this.currentWaiterId = waiterId;
  }

  if (newStatus === 'occupied') {
    this.lastOrderAt = new Date();
  }

  await this.save();
};

Table.prototype.assignWaiter = async function(waiterId) {
  this.currentWaiterId = waiterId;
  await this.save();
};

Table.prototype.removeWaiter = async function() {
  this.currentWaiterId = null;
  await this.save();
};

Table.prototype.generateNewQRCode = async function() {
  const secret = crypto.randomBytes(32).toString('hex');
  this.qrCodeSecret = secret;
  
  const qrData = {
    tableId: this.id,
    tableNumber: this.number,
    secret
  };
  
  const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
  this.qrCode = qrCodeUrl;
  
  await this.save();
  return qrCodeUrl;
};

Table.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.qrCodeSecret;
  return values;
};

module.exports = Table; 