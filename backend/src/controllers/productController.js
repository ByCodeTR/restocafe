const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      isActive,
      isFeatured,
      minStock,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (minStock === 'true') {
      query.stockTracking = true;
      query.currentStock = { $lte: '$minStock' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortQuery = {};
    sortQuery[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      category,
      basePrice,
      variations,
      images,
      stockTracking,
      currentStock,
      minStock,
      preparationTime,
      allergens,
      nutritionalInfo,
      tags,
      code
    } = req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: 'Kategori bulunamadı' });
    }

    // Check if code is unique if provided
    if (code) {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return res.status(400).json({ message: 'Bu ürün kodu zaten kullanımda' });
      }
    }

    const product = new Product({
      name,
      description,
      category,
      basePrice,
      variations,
      images,
      stockTracking,
      currentStock,
      minStock,
      preparationTime,
      allergens,
      nutritionalInfo,
      tags,
      code,
      priceHistory: [{
        price: basePrice,
        startDate: new Date()
      }]
    });

    await product.save();

    // Populate category in response
    await product.populate('category', 'name');

    res.status(201).json({
      message: 'Ürün başarıyla oluşturuldu',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      category,
      basePrice,
      variations,
      images,
      stockTracking,
      currentStock,
      minStock,
      preparationTime,
      isActive,
      isFeatured,
      allergens,
      nutritionalInfo,
      tags,
      code
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Check if category exists if changing
    if (category && category !== product.category.toString()) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({ message: 'Kategori bulunamadı' });
      }
      product.category = category;
    }

    // Check if code is unique if changing
    if (code && code !== product.code) {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return res.status(400).json({ message: 'Bu ürün kodu zaten kullanımda' });
      }
      product.code = code;
    }

    // Update fields
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (variations) product.variations = variations;
    if (images) product.images = images;
    if (stockTracking !== undefined) product.stockTracking = stockTracking;
    if (currentStock !== undefined) product.currentStock = currentStock;
    if (minStock !== undefined) product.minStock = minStock;
    if (preparationTime !== undefined) product.preparationTime = preparationTime;
    if (typeof isActive === 'boolean') product.isActive = isActive;
    if (typeof isFeatured === 'boolean') product.isFeatured = isFeatured;
    if (allergens) product.allergens = allergens;
    if (nutritionalInfo) product.nutritionalInfo = nutritionalInfo;
    if (tags) product.tags = tags;

    await product.save();

    // Populate category in response
    await product.populate('category', 'name');

    res.json({
      message: 'Ürün başarıyla güncellendi',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    await product.remove();

    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin & Kitchen)
exports.updateStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity, type } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    if (!product.stockTracking) {
      return res.status(400).json({ message: 'Bu ürün için stok takibi yapılmıyor' });
    }

    await product.updateStock(quantity, type);

    res.json({
      message: 'Stok başarıyla güncellendi',
      currentStock: product.currentStock
    });
  } catch (error) {
    console.error('Update stock error:', error);
    if (error.message === 'Yetersiz stok') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private (Admin & Kitchen)
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.getLowStockProducts();
    res.json(products);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 