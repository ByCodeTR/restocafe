const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const User = require('../models/User');
const Report = require('../models/Report');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } = require('date-fns');

// Satış Raporları
const generateSalesReport = async (timeRange, customRange = null) => {
  let startDate, endDate;

  switch (timeRange) {
    case 'daily':
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
      break;
    case 'weekly':
      startDate = startOfWeek(new Date());
      endDate = endOfWeek(new Date());
      break;
    case 'monthly':
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
    case 'custom':
      startDate = startOfDay(new Date(customRange.start));
      endDate = endOfDay(new Date(customRange.end));
      break;
  }

  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'completed'
  }).populate('items.product');

  const salesData = {
    totalSales: 0,
    totalOrders: orders.length,
    averageOrderValue: 0,
    itemsSold: 0,
    salesByHour: {},
    topProducts: {},
    paymentMethods: {}
  };

  orders.forEach(order => {
    salesData.totalSales += order.total;
    salesData.itemsSold += order.items.reduce((acc, item) => acc + item.quantity, 0);
    
    // Saatlik satışlar
    const hour = order.createdAt.getHours();
    salesData.salesByHour[hour] = (salesData.salesByHour[hour] || 0) + order.total;

    // Ürün satışları
    order.items.forEach(item => {
      const productName = item.product.name;
      if (!salesData.topProducts[productName]) {
        salesData.topProducts[productName] = {
          quantity: 0,
          revenue: 0
        };
      }
      salesData.topProducts[productName].quantity += item.quantity;
      salesData.topProducts[productName].revenue += item.price * item.quantity;
    });

    // Ödeme yöntemleri
    salesData.paymentMethods[order.paymentMethod] = 
      (salesData.paymentMethods[order.paymentMethod] || 0) + order.total;
  });

  salesData.averageOrderValue = 
    orders.length > 0 ? salesData.totalSales / orders.length : 0;

  return salesData;
};

// Ürün Raporları
const generateProductReport = async () => {
  const products = await Product.find().populate('category');
  const orders = await Order.find({ status: 'completed' })
    .populate('items.product');

  const productData = {};

  // Ürün bazlı satış verileri
  products.forEach(product => {
    productData[product._id] = {
      name: product.name,
      category: product.category.name,
      totalQuantitySold: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      orderCount: 0
    };
  });

  // Satış verilerini işle
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productData[item.product._id]) {
        productData[item.product._id].totalQuantitySold += item.quantity;
        productData[item.product._id].totalRevenue += item.price * item.quantity;
        productData[item.product._id].orderCount++;
      }
    });
  });

  // Ortalama sipariş değerlerini hesapla
  Object.values(productData).forEach(product => {
    product.averageOrderValue = 
      product.orderCount > 0 ? product.totalRevenue / product.orderCount : 0;
  });

  return productData;
};

// Garson Performans Raporu
const generateWaiterReport = async (timeRange) => {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'completed'
  }).populate('waiter');

  const waiterData = {};

  orders.forEach(order => {
    const waiterId = order.waiter._id.toString();
    if (!waiterData[waiterId]) {
      waiterData[waiterId] = {
        name: order.waiter.name,
        totalOrders: 0,
        totalSales: 0,
        averageOrderValue: 0,
        itemsSold: 0,
        tables: new Set(),
        topProducts: {}
      };
    }

    waiterData[waiterId].totalOrders++;
    waiterData[waiterId].totalSales += order.total;
    waiterData[waiterId].tables.add(order.table.toString());
    waiterData[waiterId].itemsSold += order.items.reduce((acc, item) => acc + item.quantity, 0);

    order.items.forEach(item => {
      const productId = item.product.toString();
      if (!waiterData[waiterId].topProducts[productId]) {
        waiterData[waiterId].topProducts[productId] = {
          quantity: 0,
          revenue: 0
        };
      }
      waiterData[waiterId].topProducts[productId].quantity += item.quantity;
      waiterData[waiterId].topProducts[productId].revenue += item.price * item.quantity;
    });
  });

  // Son hesaplamalar
  Object.values(waiterData).forEach(waiter => {
    waiter.averageOrderValue = 
      waiter.totalOrders > 0 ? waiter.totalSales / waiter.totalOrders : 0;
    waiter.tables = waiter.tables.size;
    waiter.topProducts = Object.entries(waiter.topProducts)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5);
  });

  return waiterData;
};

// Müşteri Analiz Raporu
const generateCustomerReport = async () => {
  const customers = await Customer.find()
    .populate('orders')
    .populate('reservations');

  const customerData = {
    totalCustomers: customers.length,
    activeCustomers: 0,
    newCustomers: 0,
    loyaltyTiers: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    },
    averageSpendPerCustomer: 0,
    topCustomers: [],
    customerRetention: 0
  };

  const lastMonth = subMonths(new Date(), 1);
  let totalSpend = 0;

  customers.forEach(customer => {
    // Aktif müşteriler (son 1 ayda işlem yapanlar)
    const hasRecentActivity = customer.orders.some(order => 
      order.createdAt >= lastMonth) || 
      customer.reservations.some(res => res.time >= lastMonth);
    
    if (hasRecentActivity) customerData.activeCustomers++;

    // Yeni müşteriler (son 1 ayda kaydolanlar)
    if (customer.createdAt >= lastMonth) customerData.newCustomers++;

    // Sadakat seviyeleri
    customerData.loyaltyTiers[customer.membershipTier]++;

    // Toplam harcama
    totalSpend += customer.stats.totalSpent;

    // En iyi müşteriler
    if (customer.stats.totalSpent > 0) {
      customerData.topCustomers.push({
        id: customer._id,
        name: customer.name,
        totalSpent: customer.stats.totalSpent,
        visits: customer.stats.totalVisits,
        loyaltyPoints: customer.loyaltyPoints
      });
    }
  });

  // Son hesaplamalar
  customerData.averageSpendPerCustomer = totalSpend / customers.length;
  customerData.topCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
  customerData.topCustomers = customerData.topCustomers.slice(0, 10);
  customerData.customerRetention = 
    (customerData.activeCustomers / customerData.totalCustomers) * 100;

  return customerData;
};

// Rezervasyon Analiz Raporu
const generateReservationReport = async (timeRange) => {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  const reservations = await Reservation.find({
    time: { $gte: startDate, $lte: endDate }
  }).populate('customer').populate('table');

  const reservationData = {
    totalReservations: reservations.length,
    statusBreakdown: {
      confirmed: 0,
      seated: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0
    },
    averagePartySize: 0,
    peakHours: {},
    popularTables: {},
    customerTypes: {
      new: 0,
      returning: 0
    }
  };

  let totalPartySize = 0;
  const customerVisits = new Map();

  reservations.forEach(reservation => {
    // Durum dağılımı
    reservationData.statusBreakdown[reservation.status]++;

    // Parti büyüklüğü
    totalPartySize += reservation.partySize;

    // Peak saatler
    const hour = reservation.time.getHours();
    reservationData.peakHours[hour] = 
      (reservationData.peakHours[hour] || 0) + 1;

    // Popüler masalar
    const tableId = reservation.table._id.toString();
    if (!reservationData.popularTables[tableId]) {
      reservationData.popularTables[tableId] = {
        number: reservation.table.number,
        capacity: reservation.table.capacity,
        reservations: 0
      };
    }
    reservationData.popularTables[tableId].reservations++;

    // Müşteri tipleri
    if (reservation.customer) {
      const customerId = reservation.customer._id.toString();
      customerVisits.set(customerId, 
        (customerVisits.get(customerId) || 0) + 1);
    }
  });

  // Son hesaplamalar
  reservationData.averagePartySize = 
    reservations.length > 0 ? totalPartySize / reservations.length : 0;

  customerVisits.forEach((visits, customerId) => {
    if (visits === 1) {
      reservationData.customerTypes.new++;
    } else {
      reservationData.customerTypes.returning++;
    }
  });

  return reservationData;
};

// Rapor Oluşturma ve Önbellekleme
const generateReport = async (reportType, timeRange, customRange = null) => {
  let reportData;

  switch (reportType) {
    case 'sales':
      reportData = await generateSalesReport(timeRange, customRange);
      break;
    case 'products':
      reportData = await generateProductReport();
      break;
    case 'waiters':
      reportData = await generateWaiterReport(timeRange);
      break;
    case 'customers':
      reportData = await generateCustomerReport();
      break;
    case 'reservations':
      reportData = await generateReservationReport(timeRange);
      break;
    default:
      throw new Error('Geçersiz rapor tipi');
  }

  // Raporu önbellekle
  const existingReport = await Report.findByTypeAndRange(reportType, timeRange);
  if (existingReport) {
    await existingReport.updateCache(reportData);
    return existingReport;
  }

  // Yeni rapor oluştur
  const newReport = new Report({
    name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
    type: reportType,
    config: {
      timeRange,
      customRange
    }
  });

  await newReport.updateCache(reportData);
  return newReport;
};

module.exports = {
  generateReport,
  generateSalesReport,
  generateProductReport,
  generateWaiterReport,
  generateCustomerReport,
  generateReservationReport
}; 