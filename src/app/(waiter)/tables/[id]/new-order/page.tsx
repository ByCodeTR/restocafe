'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

// Örnek veri
const CATEGORIES = ['Pizzalar', 'Burgerler', 'İçecekler', 'Tatlılar'];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Karışık Pizza', price: 120.00, category: 'Pizzalar' },
  { id: 2, name: 'Margarita', price: 100.00, category: 'Pizzalar' },
  { id: 3, name: 'Klasik Burger', price: 90.00, category: 'Burgerler' },
  { id: 4, name: 'Cheeseburger', price: 95.00, category: 'Burgerler' },
  { id: 5, name: 'Kola', price: 15.00, category: 'İçecekler' },
  { id: 6, name: 'Ayran', price: 10.00, category: 'İçecekler' },
  { id: 7, name: 'Sufle', price: 45.00, category: 'Tatlılar' },
  { id: 8, name: 'Tiramisu', price: 50.00, category: 'Tatlılar' },
];

export default function NewOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const tableId = params.id as string;
  const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = () => {
    if (!selectedProduct) return;

    setCart(prev => {
      const existingItem = prev.find(item => item.id === selectedProduct.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item
        );
      }
      return [...prev, { ...selectedProduct, quantity, notes }];
    });

    setSelectedProduct(null);
    setQuantity(1);
    setNotes('');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const submitOrder = () => {
    // Burada sipariş gönderme işlemi yapılacak
    router.back();
  };

  return (
    <div className="pb-24">
      {/* Üst Bilgi */}
      <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Yeni Sipariş - Masa {tableId}</h1>
        <div className="w-6" />
      </div>

      {/* Kategori Seçimi */}
      <div className="p-4 overflow-x-auto">
        <div className="flex space-x-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors
                ${selectedCategory === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-pink-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`p-4 rounded-xl text-left transition-colors
              ${selectedProduct?.id === product.id
                ? 'bg-pink-50 border-2 border-pink-600'
                : 'bg-white border border-gray-200'
              }`}
          >
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-pink-600 mt-2">₺{product.price.toFixed(2)}</p>
          </button>
        ))}
      </div>

      {/* Ürün Seçim Detayları */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-20">
          <div className="bg-white rounded-t-2xl p-6 w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-xl font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                +
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sipariş notu ekleyin..."
              className="w-full p-3 rounded-lg border border-gray-200 resize-none"
              rows={2}
            />

            <button
              onClick={addToCart}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700"
            >
              Sepete Ekle (₺{(selectedProduct.price * quantity).toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* Sepet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {item.quantity}x {item.name}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500">Not: {item.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-2 border-t">
              <span className="font-medium">Toplam</span>
              <span className="text-xl font-semibold text-pink-600">
                ₺{totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={submitOrder}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700"
            >
              Siparişi Onayla
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 