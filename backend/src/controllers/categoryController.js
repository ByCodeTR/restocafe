const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { tree } = req.query;
    
    let categories;
    if (tree === 'true') {
      categories = await Category.getCategoryTree();
    } else {
      categories = await Category.find()
        .populate('parentCategory', 'name')
        .populate('productsCount')
        .sort('order');
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name')
      .populate('subcategories')
      .populate('productsCount');

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parentCategory, order, color, image } = req.body;

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu kategori adı zaten kullanımda' });
    }

    // If parent category is provided, check if it exists
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: 'Üst kategori bulunamadı' });
      }
    }

    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      order: order || 0,
      color,
      image
    });

    await category.save();

    res.status(201).json({
      message: 'Kategori başarıyla oluşturuldu',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parentCategory, order, color, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    // Check if new category name already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Bu kategori adı zaten kullanımda' });
      }
      category.name = name;
    }

    // Check if new parent category creates a cycle
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: 'Üst kategori bulunamadı' });
      }
      
      // Check if the new parent is not a child of current category
      let currentParent = parent;
      while (currentParent) {
        if (currentParent._id.toString() === category._id.toString()) {
          return res.status(400).json({ message: 'Kategori döngüsü oluşturulamaz' });
        }
        currentParent = await Category.findById(currentParent.parentCategory);
      }
      
      category.parentCategory = parentCategory;
    }

    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;
    if (color) category.color = color;
    if (image !== undefined) category.image = image;
    if (typeof isActive === 'boolean') category.isActive = isActive;

    await category.save();

    // Populate the response
    await category.populate('parentCategory', 'name');
    await category.populate('subcategories');
    await category.populate('productsCount');

    res.json({
      message: 'Kategori başarıyla güncellendi',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parentCategory: category._id });
    if (subcategories > 0) {
      return res.status(400).json({ message: 'Alt kategorileri olan bir kategori silinemez' });
    }

    await category.remove();

    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Reorder categories
// @route   PATCH /api/categories/reorder
// @access  Private (Admin only)
exports.reorderCategories = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categories } = req.body;

    // Update each category's order
    const updatePromises = categories.map(({ id, order }) => 
      Category.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Kategoriler başarıyla yeniden sıralandı' });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 