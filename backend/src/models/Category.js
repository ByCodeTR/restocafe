const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori adı zorunludur'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  color: {
    type: String,
    default: '#000000'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Index for faster queries
categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ order: 1 });

// Middleware to prevent deletion if category has products
categorySchema.pre('remove', async function(next) {
  const Product = mongoose.model('Product');
  const productsCount = await Product.countDocuments({ category: this._id });
  
  if (productsCount > 0) {
    const err = new Error('Bu kategoride ürünler bulunduğu için silinemez');
    next(err);
  }
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ parentCategory: null })
    .populate({
      path: 'subcategories',
      populate: { 
        path: 'subcategories',
        populate: {
          path: 'productsCount'
        }
      }
    })
    .populate('productsCount')
    .sort('order');
  
  return categories;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 