import './commands';
import '@testing-library/cypress/add-commands';

// Suppress uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

// Preserve cookie between tests
Cypress.Cookies.defaults({
  preserve: 'token',
});

// Custom commands
Cypress.Commands.add('login', (email = 'admin@example.com', password = 'password123') => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('createTestTable', (tableData = { number: '1', capacity: 4 }) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/tables`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: tableData,
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

Cypress.Commands.add('createTestProduct', (productData = {
  name: 'Test Product',
  price: 10.99,
  categoryId: '1',
  description: 'Test product description',
}) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/products`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: productData,
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

Cypress.Commands.add('createTestOrder', (orderData = {
  tableId: '1',
  items: [
    { productId: '1', quantity: 2 },
  ],
}) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/orders`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: orderData,
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
}); 