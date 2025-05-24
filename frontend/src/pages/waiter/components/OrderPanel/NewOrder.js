import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../../store/slices/waiterSlice';
import { FiSearch, FiPlus, FiMinus } from 'react-icons/fi';

const ProductCard = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleAdd = () => {
    onAdd({
      product,
      quantity,
      variations: selectedVariations,
      notes
    });
    setQuantity(1);
    setSelectedVariations([]);
    setNotes('');
    setShowDetails(false);
  };

  const handleVariationChange = (variation, value) => {
    const existingIndex = selectedVariations.findIndex(v => v.name === variation.name);
    if (existingIndex !== -1) {
      const newVariations = [...selectedVariations];
      newVariations[existingIndex] = { ...variation, value };
      setSelectedVariations(newVariations);
    } else {
      setSelectedVariations([...selectedVariations, { ...variation, value }]);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
          <p className="text-sm font-medium mt-1">₺{product.price.toFixed(2)}</p>
        </div>
        
        {!showDetails && (
          <button
            onClick={() => setShowDetails(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ekle
          </button>
        )}
      </div>

      {showDetails && (
        <div className="mt-4 space-y-4">
          {/* Miktar Seçimi */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Varyasyonlar */}
          {product.variations?.map(variation => (
            <div key={variation.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {variation.name}
              </label>
              <select
                value={selectedVariations.find(v => v.name === variation.name)?.value || ''}
                onChange={(e) => handleVariationChange(variation, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {variation.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {option.price > 0 && ` (+₺${option.price.toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Notlar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Özel Not
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Örn: Acısız olsun"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Sepete Ekle
            </button>
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NewOrder = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories, products } = useSelector(state => ({
    categories: state.categories.items,
    products: state.products.items
  }));

  // Ürünleri filtrele
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productData) => {
    dispatch(addToCart(productData));
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Arama ve Kategori Filtreleri */}
      <div className="p-4 border-b sticky top-0 bg-white">
        <div className="flex space-x-4">
          {/* Arama */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kategori Filtresi */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Ürün bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrder; 