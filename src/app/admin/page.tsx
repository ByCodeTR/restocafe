'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Günlük Ciro</p>
              <p className="text-2xl font-bold text-gray-800">₺2,450</p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">↑ 12%</span>
            <span className="text-sm text-gray-500 ml-2">geçen günden</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aktif Siparişler</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
            <span className="text-2xl">📝</span>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">4 masada</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dolu Masalar</p>
              <p className="text-2xl font-bold text-gray-800">6/12</p>
            </div>
            <span className="text-2xl">🪑</span>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">2 rezervasyon</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aktif Personel</p>
              <p className="text-2xl font-bold text-gray-800">5</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">2 garson, 3 mutfak</span>
          </div>
        </div>
      </div>

      {/* Grafikler ve Tablolar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Son Siparişler</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">Masa {order}</p>
                  <p className="text-sm text-gray-500">2 × Karışık Pizza, 1 × Kola</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">₺180</p>
                  <p className="text-sm text-gray-500">5 dk önce</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popüler Ürünler */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Popüler Ürünler</h2>
          <div className="space-y-4">
            {[
              { name: 'Karışık Pizza', count: 24, revenue: '2,160' },
              { name: 'Izgara Köfte', count: 18, revenue: '1,620' },
              { name: 'Tavuk Şiş', count: 15, revenue: '1,200' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.count} sipariş</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">₺{item.revenue}</p>
                  <p className="text-sm text-green-600">↑ 8%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 