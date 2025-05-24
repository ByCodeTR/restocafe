const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: ['waiter'],
    validate: {
      isValidRoles(value) {
        const validRoles = ['admin', 'manager', 'waiter', 'kitchen', 'cashier'];
        if (!Array.isArray(value) || !value.every(role => validRoles.includes(role))) {
          throw new Error('Geçersiz rol');
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastLoginAt: {
    type: DataTypes.DATE
  },
  passwordResetToken: {
    type: DataTypes.STRING
  },
  passwordResetExpires: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this.id,
      roles: this.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.hasRole = function(role) {
  return this.roles.includes(role);
};

User.prototype.hasAnyRole = function(roles) {
  return this.roles.some(role => roles.includes(role));
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.passwordResetToken;
  delete values.passwordResetExpires;
  return values;
};

// Static methods
User.generatePasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);
  return { resetToken, hash };
};

module.exports = User; 