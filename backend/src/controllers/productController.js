const Product = require('../models/Product');
const Category = require('../models/Category');
const { ValidationError, Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const socketService = require('../services/socketService');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getAllProducts = async (req, res) => {
  const {
    categoryId,
    search,
    minPrice,
    maxPrice,
    isAvailable,
    isVegetarian,
    isVegan,
    isGlutenFree,
    spicyLevel,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'ASC'
  } = req.query;

  // Filtreleme koşulları
  const where = { isActive: true };
  
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
  if (isAvailable !== undefined) where.isAvailable = isAvailable;
  if (isVegetarian !== undefined) where.isVegetarian = isVegetarian;
  if (isVegan !== undefined) where.isVegan = isVegan;
  if (isGlutenFree !== undefined) where.isGlutenFree = isGlutenFree;
  if (spicyLevel) where.spicyLevel = spicyLevel;

  // Sadece ana ürünleri listele (varyant olmayanlar)
  where.parentId = null;

  // Sayfalama
  const offset = (page - 1) * limit;
  
  // Sıralama
  const order = [[sortBy, sortOrder]];

  const { count, rows: products } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      },
      {
        model: Product,
        as: 'parent',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Product,
        as: 'variants',
        attributes: ['id', 'name', 'price'],
        required: false
      }
    ],
    order,
    offset,
    limit: parseInt(limit)
  });

  res.json({
    products,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    totalItems: count
  });
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      },
      {
        model: Product,
        as: 'parent',
        attributes: ['id', 'name'],
        required: false
      },
      {
        model: Product,
        as: 'variants',
        attributes: ['id', 'name', 'price', 'options'],
        required: false
      }
    ]
  });

  if (!product) {
    throw new ApiError(404, 'Ürün bulunamadı');
  }

  res.json(product);
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
  try {
    // Kategori kontrolü
    const category = await Category.findByPk(req.body.categoryId);
    if (!category) {
      throw new ApiError(400, 'Geçersiz kategori');
    }

    // Eğer bir varyant ise ana ürün kontrolü
    if (req.body.parentId) {
      const parentProduct = await Product.findByPk(req.body.parentId);
      if (!parentProduct) {
        throw new ApiError(400, 'Ana ürün bulunamadı');
      }
      if (parentProduct.parentId) {
        throw new ApiError(400, 'Bir varyantın varyantı olamaz');
      }
    }

    const product = await Product.create(req.body);
    
    // İlişkili verileri içeren ürünü döndür
    const productWithRelations = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json(productWithRelations);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz ürün bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Ürün bulunamadı');
  }

  try {
    const oldStock = product.stock;
    await product.update(req.body);

    // Stok değişikliği varsa kontrol et
    if (product.stock !== oldStock) {
      // Stok minimum seviyenin altına düştüyse bildirim gönder
      if (product.stock <= product.minStock) {
        socketService.notifyLowStock(product);
      }

      // Stok tükendiyse bildirim gönder
      if (product.stock === 0) {
        socketService.notifyOutOfStock(product);
      }
    }

    // İlişkili verileri içeren güncel ürünü döndür
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        },
        {
          model: Product,
          as: 'parent',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Product,
          as: 'variants',
          attributes: ['id', 'name', 'price', 'options'],
          required: false
        }
      ]
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(400, 'Geçersiz ürün bilgileri', error.errors);
    }
    throw error;
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Ürün bulunamadı');
  }

  // Varyantları kontrol et
  const variants = await product.getVariants();
  if (variants.length > 0) {
    throw new ApiError(400, 'Varyantları olan ürün silinemez');
  }

  await product.destroy();
  res.status(204).send();
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin, Manager only)
exports.updateStock = async (req, res) => {
  const { quantity, operation } = req.body;
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Ürün bulunamadı');
  }

  try {
    const oldStock = product.stock;
    await product.updateStock(quantity, operation);

    // Stok minimum seviyenin altına düştüyse bildirim gönder
    if (product.stock <= product.minStock) {
      socketService.notifyLowStock(product);
    }

    // Stok tükendiyse bildirim gönder
    if (product.stock === 0) {
      socketService.notifyOutOfStock(product);
    }

    res.json(product);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// @desc    Update product availability
// @route   PATCH /api/products/:id/availability
// @access  Private (Admin & Kitchen)
exports.updateAvailability = async (req, res) => {
  const { isAvailable } = req.body;
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Ürün bulunamadı');
  }

  if (typeof isAvailable !== 'boolean') {
    throw new ApiError(400, 'Geçersiz kullanılabilirlik değeri');
  }

  product.isAvailable = isAvailable;
  await product.save();

  res.json(product);
}; 