const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'adet'
  },
  preparationTime: {
    type: DataTypes.INTEGER, // Dakika cinsinden
    allowNull: true,
    validate: {
      min: 0
    }
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  isVegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isGlutenFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  spicyLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  allergens: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: true
  },
  nutritionFacts: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    comment: 'Ana ürün ID (varyant ürünler için)'
  }
}, {
  hooks: {
    beforeValidate: (product) => {
      // Slug oluştur
      if (product.name && (!product.slug || product.changed('name'))) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

// Instance methods
Product.prototype.isInStock = function() {
  return this.stock > 0 && this.isActive && this.isAvailable;
};

Product.prototype.getCurrentPrice = function() {
  return this.discountedPrice || this.price;
};

Product.prototype.hasDiscount = function() {
  return this.discountedPrice !== null && this.discountedPrice < this.price;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.hasDiscount()) return 0;
  return Math.round((1 - (this.discountedPrice / this.price)) * 100);
};

Product.prototype.getVariants = async function() {
  if (this.parentId) return []; // Varyant ürünlerin alt varyantları olamaz
  
  return await Product.findAll({
    where: {
      parentId: this.id,
      isActive: true
    }
  });
};

module.exports = Product; 