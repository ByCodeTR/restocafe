'use client';

import StatCard from '@/components/dashboard/StatCard';
import ActiveTables from '@/components/dashboard/ActiveTables';
import {
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Hoş geldiniz! İşletmenizin genel durumuna göz atın.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Günlük Ciro"
          value="₺12,450"
          change={8.2}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Aktif Masalar"
          value="14/20"
          icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Toplam Sipariş"
          value="86"
          change={12.5}
          icon={<ShoppingCartIcon className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Stok Uyarıları"
          value="3"
          icon={<ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Günlük Satışlar</h2>
            <select className="text-sm border-gray-300 rounded-lg">
              <option>Bugün</option>
              <option>Bu Hafta</option>
              <option>Bu Ay</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Grafik bileşeni buraya eklenecek */}
            <p className="text-gray-500">Grafik yakında eklenecek</p>
          </div>
        </div>

        {/* Active Tables */}
        <ActiveTables />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Tümünü Gör
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Sipariş No</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Masa</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Tutar</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Durum</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Saat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: '#12345', table: 'Masa 4', amount: 245.50, status: 'Hazırlanıyor', time: '14:30' },
                { id: '#12344', table: 'Masa 7', amount: 180.00, status: 'Tamamlandı', time: '14:25' },
                { id: '#12343', table: 'Masa 2', amount: 320.75, status: 'Tamamlandı', time: '14:15' },
                { id: '#12342', table: 'Masa 9', amount: 150.25, status: 'Tamamlandı', time: '14:00' },
              ].map((order) => (
                <tr key={order.id} className="text-sm text-gray-800">
                  <td className="py-4">{order.id}</td>
                  <td>{order.table}</td>
                  <td>₺{order.amount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Hazırlanıyor'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Stok Uyarıları</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Tümünü Gör
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Kola', current: 5, min: 10, unit: 'adet' },
            { name: 'Tavuk Göğsü', current: 2.5, min: 5, unit: 'kg' },
            { name: 'Domates', current: 3, min: 8, unit: 'kg' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-red-600">
                  Mevcut: {item.current} {item.unit} (Min: {item.min} {item.unit})
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                Sipariş Ver
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 