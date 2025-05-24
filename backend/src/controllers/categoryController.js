const Category = require('../models/Category');
const Product = require('../models/Product');
const { ValidationError } = require('sequelize');
const ApiError = require('../utils/ApiError');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getAllCategories = async (req, res) => {
  const { tree } = req.query;
  
  if (tree === 'true') {
    const categoryTree = await Category.getTree();
    return res.json(categoryTree);
  }

  const categories = await Category.findAll({
    include: [{
      model: Category,
      as: 'parent',
      attributes: ['id', 'name']
    }],
    order: [['order', 'ASC']]
  });

  res.json(categories);
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name']
      },
      {
        model: Category,
        as: 'children',
        attributes: ['id', 'name', 'order'],
        where: { isActive: true },
        required: false
      },
      {
        model: Product,
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'price', 'image']
      }
    ]
  });

  if (!category) {
    throw new ApiError(404, 'Kategori bulunamadı');
  }

  // Kategori yolunu al
  const fullPath = await category.getFullPath();
  const response = category.toJSON();
  response.fullPath = fullPath;

  res.json(response);
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res) => {
  try {
    // Eğer üst kategori varsa kontrol et
    if (req.body.parentId) {
      const parentCategory = await Category.findByPk(req.body.parentId);
      if (!parentCategory) {
        throw new ApiError(400, 'Üst kategori bulunamadı');
      }
    }

    const category = await Category.create(req.body);
    
    // İlişkili verileri içeren kategoriyi döndür
    const categoryWithRelations = await Category.findByPk(category.id, {
      include: [{
        model: Category,
        as: 'parent',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json(categoryWithRelations);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz kategori bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  
  if (!category) {
    throw new ApiError(404, 'Kategori bulunamadı');
  }

  // Kendisini kendi alt kategorisi yapmaya çalışıyor mu kontrol et
  if (req.body.parentId && req.body.parentId === category.id) {
    throw new ApiError(400, 'Kategori kendisinin alt kategorisi olamaz');
  }

  // Üst kategori değişiyorsa kontrol et
  if (req.body.parentId && req.body.parentId !== category.parentId) {
    const parentCategory = await Category.findByPk(req.body.parentId);
    if (!parentCategory) {
      throw new ApiError(400, 'Üst kategori bulunamadı');
    }

    // Döngüsel bağımlılık kontrolü
    let currentParent = parentCategory;
    while (currentParent) {
      if (currentParent.id === category.id) {
        throw new ApiError(400, 'Döngüsel kategori yapısı oluşturulamaz');
      }
      currentParent = await Category.findByPk(currentParent.parentId);
    }
  }

  try {
    await category.update(req.body);
    
    // İlişkili verileri içeren güncel kategoriyi döndür
    const updatedCategory = await Category.findByPk(category.id, {
      include: [{
        model: Category,
        as: 'parent',
        attributes: ['id', 'name']
      }]
    });

    res.json(updatedCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz kategori bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
exports.deleteCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  
  if (!category) {
    throw new ApiError(404, 'Kategori bulunamadı');
  }

  // Alt kategorileri kontrol et
  const children = await category.getChildren();
  if (children.length > 0) {
    throw new ApiError(400, 'Alt kategorileri olan kategori silinemez');
  }

  // Ürünleri kontrol et
  const hasProducts = await category.hasProducts();
  if (hasProducts) {
    throw new ApiError(400, 'Ürünleri olan kategori silinemez');
  }

  await category.destroy();
  res.status(204).send();
};

// @desc    Reorder categories
// @route   PATCH /api/categories/reorder
// @access  Private (Admin only)
exports.reorderCategories = async (req, res) => {
  const { orders } = req.body;
  
  if (!Array.isArray(orders)) {
    throw new ApiError(400, 'Geçersiz sıralama verisi');
  }

  // Sıralama verilerini doğrula
  for (const item of orders) {
    if (!item.id || typeof item.order !== 'number') {
      throw new ApiError(400, 'Geçersiz sıralama verisi');
    }
  }

  // Toplu güncelleme yap
  await Promise.all(
    orders.map(({ id, order }) =>
      Category.update({ order }, { where: { id } })
    )
  );

  // Güncel kategori listesini döndür
  const categories = await Category.findAll({
    order: [['order', 'ASC']]
  });

  res.json(categories);
}; 