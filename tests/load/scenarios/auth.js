import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.1'],             // Error rate must be less than 10%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

// Test data
const TEST_USERS = [
  { email: 'test1@example.com', password: 'password123' },
  { email: 'test2@example.com', password: 'password123' },
  { email: 'test3@example.com', password: 'password123' },
];

export function setup() {
  // Create test users if they don't exist
  TEST_USERS.forEach(user => {
    const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'user created or exists': (r) => r.status === 201 || r.status === 409,
    });
  });
}

export default function () {
  // Randomly select a test user
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];

  // Login request
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check login response
  const loginSuccess = check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    console.log(`Login failed for ${user.email}: ${loginRes.status} ${loginRes.body}`);
    return;
  }

  const token = loginRes.json('token');

  // Get user profile
  const profileRes = http.get(`${BASE_URL}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  // Check profile response
  check(profileRes, {
    'profile retrieved': (r) => r.status === 200,
    'profile has email': (r) => r.json('email') === user.email,
  });

  // Simulate user think time
  sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds
}

export function teardown(data) {
  // Cleanup can be added here if needed
} 