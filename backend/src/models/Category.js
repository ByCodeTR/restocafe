const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeValidate: (category) => {
      // Slug oluştur
      if (category.name && (!category.slug || category.changed('name'))) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire
          .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
          .replace(/-+/g, '-') // Birden fazla tireyi tek tire yap
          .replace(/^-+|-+$/g, ''); // Baş ve sondaki tireleri kaldır
      }
    }
  }
});

// Instance methods
Category.prototype.getFullPath = async function() {
  let path = [this.name];
  let currentCategory = this;

  while (currentCategory.parentId) {
    currentCategory = await Category.findByPk(currentCategory.parentId);
    if (currentCategory) {
      path.unshift(currentCategory.name);
    } else {
      break;
    }
  }

  return path.join(' > ');
};

Category.prototype.getChildren = async function() {
  return await Category.findAll({
    where: { parentId: this.id },
    order: [['order', 'ASC']]
  });
};

Category.prototype.hasProducts = async function() {
  const products = await this.getProducts();
  return products.length > 0;
};

// Class methods
Category.getTree = async function() {
  const buildTree = (categories, parentId = null) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category.toJSON(),
        children: buildTree(categories, category.id)
      }))
      .sort((a, b) => a.order - b.order);
  };

  const categories = await Category.findAll({
    where: { isActive: true },
    order: [['order', 'ASC']]
  });

  return buildTree(categories);
};

module.exports = Category; 