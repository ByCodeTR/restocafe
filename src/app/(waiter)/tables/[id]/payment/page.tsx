'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  isPaid?: boolean;
}

// Örnek veri
const SAMPLE_BILL: BillItem[] = [
  { id: 1, name: 'Karışık Pizza', quantity: 1, price: 120.00 },
  { id: 2, name: 'Kola', quantity: 2, price: 15.00 },
  { id: 3, name: 'Tavuk Şiş', quantity: 1, price: 85.00 },
  { id: 4, name: 'Ayran', quantity: 1, price: 10.00 },
];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'multiple'>('cash');
  const [bill] = useState<BillItem[]>(SAMPLE_BILL);

  const tableId = params.id as string;
  const totalAmount = bill.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  const selectedAmount = bill
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = () => {
    // Burada ödeme işlemi yapılacak
    router.back();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24">
      {/* Üst Bilgi */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Hesap - Masa {tableId}</h1>
        <div className="w-6" />
      </div>

      {/* Hesap Detayı */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="font-medium">Toplam Tutar</span>
            <span className="text-2xl font-semibold text-pink-600">
              ₺{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {bill.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItems(prev => 
                prev.includes(item.id)
                  ? prev.filter(id => id !== item.id)
                  : [...prev, item.id]
              )}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors
                ${selectedItems.includes(item.id)
                  ? 'bg-pink-50 border-2 border-pink-600'
                  : 'hover:bg-gray-50 border-2 border-transparent'
                }
                ${item.isPaid ? 'opacity-50' : ''}`}
            >
              <div>
                <p className="font-medium">
                  {item.quantity}x {item.name}
                  {item.isPaid && ' (Ödendi)'}
                </p>
              </div>
              <p className="font-medium">₺{(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ödeme Yöntemi */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="font-medium mb-4">Ödeme Yöntemi</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 rounded-lg border-2 text-center transition-colors
              ${paymentMethod === 'cash'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:bg-gray-50'
              }`}
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">Nakit</span>
          </button>
          <button
            onClick={() => setPaymentMethod('credit')}
            className={`p-4 rounded-lg border-2 text-center transition-colors
              ${paymentMethod === 'credit'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:bg-gray-50'
              }`}
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-medium">Kredi Kartı</span>
          </button>
          <button
            onClick={() => setPaymentMethod('multiple')}
            className={`p-4 rounded-lg border-2 text-center transition-colors
              ${paymentMethod === 'multiple'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:bg-gray-50'
              }`}
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">Karma</span>
          </button>
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Ödenecek Tutar</span>
            <span className="text-xl font-semibold text-pink-600">
              ₺{(selectedItems.length ? selectedAmount : totalAmount).toFixed(2)}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handlePayment}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700"
            >
              Ödemeyi Tamamla
            </button>
            <button
              onClick={() => {/* Fiş yazdırma işlemi */}}
              className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200"
            >
              Fiş Yazdır
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 