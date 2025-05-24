import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CalculatorIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Chart.js kayıt
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Overview = () => {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeCustomers: 0
  });

  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: []
  });

  const [reservationData, setReservationData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Satış raporu
        const salesResponse = await axios.get('/api/reports/sales/daily');
        const salesReport = salesResponse.data.report;

        // Kategori raporu
        const categoryResponse = await axios.get('/api/reports/categories');
        const categoryReport = categoryResponse.data.report;

        // Rezervasyon raporu
        const reservationResponse = await axios.get('/api/reports/reservations');
        const reservationReport = reservationResponse.data.report;

        // Metrikleri güncelle
        setMetrics({
          totalSales: salesReport.totalSales,
          totalOrders: salesReport.totalOrders,
          averageOrderValue: salesReport.averageOrderValue,
          activeCustomers: reservationReport.customerTypes.active
        });

        // Satış grafiği verilerini güncelle
        setSalesData({
          labels: Object.keys(salesReport.salesByHour),
          datasets: [
            {
              label: 'Hourly Sales',
              data: Object.values(salesReport.salesByHour),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        });

        // Kategori grafiği verilerini güncelle
        const categoryLabels = Object.keys(categoryReport);
        const categoryValues = Object.values(categoryReport).map(cat => cat.totalRevenue);
        setCategoryData({
          labels: categoryLabels,
          datasets: [
            {
              label: 'Category Sales',
              data: categoryValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
              ]
            }
          ]
        });

        // Rezervasyon grafiği verilerini güncelle
        setReservationData({
          labels: Object.keys(reservationReport.peakHours),
          datasets: [
            {
              label: 'Reservations by Hour',
              data: Object.values(reservationReport.peakHours),
              backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sales
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${metrics.totalSales.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {metrics.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalculatorIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Order Value
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${metrics.averageOrderValue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Customers
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {metrics.activeCustomers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Hourly Sales
            </h3>
            <div className="mt-2">
              <Line
                data={salesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sales by Category
            </h3>
            <div className="mt-2">
              <Pie
                data={categoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Reservation Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Reservations by Hour
            </h3>
            <div className="mt-2">
              <Bar
                data={reservationData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 