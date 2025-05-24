import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 30 },  // Ramp up to 30 users
    { duration: '3m', target: 30 },  // Stay at 30 users
    { duration: '1m', target: 60 },  // Ramp up to 60 users
    { duration: '3m', target: 60 },  // Stay at 60 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1s
    errors: ['rate<0.1'],              // Error rate must be less than 10%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

// Test data
const TEST_ORDERS = [
  {
    tableId: '1',
    items: [
      { productId: '1', quantity: 2, notes: 'No onions' },
      { productId: '2', quantity: 1 }
    ]
  },
  {
    tableId: '2',
    items: [
      { productId: '3', quantity: 1 },
      { productId: '4', quantity: 3, notes: 'Extra spicy' }
    ]
  }
];

let authToken;

export function setup() {
  // Login as waiter
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'waiter@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined
  });

  authToken = loginRes.json('token');
  return { authToken };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken}`
  };

  // Create new order
  const order = TEST_ORDERS[Math.floor(Math.random() * TEST_ORDERS.length)];
  const createOrderRes = http.post(
    `${BASE_URL}/orders`,
    JSON.stringify(order),
    { headers }
  );

  const createOrderSuccess = check(createOrderRes, {
    'order created': (r) => r.status === 201,
    'has order id': (r) => r.json('id') !== undefined
  });

  if (!createOrderSuccess) {
    errorRate.add(1);
    console.log(`Order creation failed: ${createOrderRes.status} ${createOrderRes.body}`);
    return;
  }

  const orderId = createOrderRes.json('id');

  // Get order details
  const getOrderRes = http.get(
    `${BASE_URL}/orders/${orderId}`,
    { headers }
  );

  check(getOrderRes, {
    'get order successful': (r) => r.status === 200,
    'order matches': (r) => r.json('tableId') === order.tableId
  });

  // Update order status
  const updateStatusRes = http.patch(
    `${BASE_URL}/orders/${orderId}/status`,
    JSON.stringify({ status: 'PREPARING' }),
    { headers }
  );

  check(updateStatusRes, {
    'status update successful': (r) => r.status === 200,
    'status updated': (r) => r.json('status') === 'PREPARING'
  });

  // List orders
  const listOrdersRes = http.get(
    `${BASE_URL}/orders?status=PREPARING`,
    { headers }
  );

  check(listOrdersRes, {
    'list orders successful': (r) => r.status === 200,
    'orders array returned': (r) => Array.isArray(r.json('orders'))
  });

  // Simulate user think time
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

export function teardown(data) {
  // Cleanup can be added here if needed
} 