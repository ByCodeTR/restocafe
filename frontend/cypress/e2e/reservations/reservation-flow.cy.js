describe('Reservation Flow', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/reservations');
  });

  it('should create a new reservation', () => {
    // Create test table
    cy.createTestTable();

    // Open new reservation form
    cy.get('[data-testid="new-reservation-btn"]').click();

    // Fill reservation details
    cy.get('[data-testid="customer-name"]').type('John Doe');
    cy.get('[data-testid="customer-phone"]').type('1234567890');
    cy.get('[data-testid="customer-email"]').type('john@example.com');
    cy.get('[data-testid="guest-count"]').clear().type('4');
    
    // Select date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('[data-testid="reservation-date"]').type(tomorrow.toISOString().split('T')[0]);
    cy.get('[data-testid="reservation-time"]').type('19:00');

    // Select table
    cy.get('[data-testid="table-select"]').click();
    cy.contains('Table 1').click();

    // Add notes
    cy.get('[data-testid="reservation-notes"]').type('Birthday celebration');

    // Submit reservation
    cy.get('[data-testid="submit-reservation"]').click();

    // Verify reservation created
    cy.contains('Reservation created successfully').should('be.visible');
    cy.contains('John Doe').should('be.visible');
    cy.contains('19:00').should('be.visible');
  });

  it('should update reservation status', () => {
    // Create test reservation via API
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reservations`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: {
        customerName: 'Jane Doe',
        customerPhone: '0987654321',
        customerEmail: 'jane@example.com',
        guestCount: 2,
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        tableId: '1',
        status: 'PENDING',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    // Refresh page
    cy.reload();

    // Update status
    cy.get('[data-testid="reservation-status-btn"]').first().click();
    cy.contains('CONFIRMED').click();

    // Verify status updated
    cy.contains('Status updated successfully').should('be.visible');
    cy.contains('CONFIRMED').should('be.visible');
  });

  it('should handle reservation cancellation', () => {
    // Create test reservation via API
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reservations`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: {
        customerName: 'Bob Smith',
        customerPhone: '5555555555',
        customerEmail: 'bob@example.com',
        guestCount: 3,
        date: new Date().toISOString().split('T')[0],
        time: '21:00',
        tableId: '1',
        status: 'CONFIRMED',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    // Refresh page
    cy.reload();

    // Cancel reservation
    cy.get('[data-testid="cancel-reservation-btn"]').first().click();
    cy.get('[data-testid="cancel-reason"]').type('Customer cancelled');
    cy.get('[data-testid="confirm-cancel"]').click();

    // Verify cancellation
    cy.contains('Reservation cancelled successfully').should('be.visible');
    cy.contains('CANCELLED').should('be.visible');
  });

  it('should show conflict warning for overlapping reservations', () => {
    // Create test table
    cy.createTestTable();

    // Create existing reservation
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reservations`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: {
        customerName: 'Existing Customer',
        customerPhone: '1111111111',
        customerEmail: 'existing@example.com',
        guestCount: 4,
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        tableId: '1',
        status: 'CONFIRMED',
      },
    });

    // Try to create overlapping reservation
    cy.get('[data-testid="new-reservation-btn"]').click();
    cy.get('[data-testid="customer-name"]').type('New Customer');
    cy.get('[data-testid="customer-phone"]').type('2222222222');
    cy.get('[data-testid="customer-email"]').type('new@example.com');
    cy.get('[data-testid="guest-count"]').clear().type('4');
    cy.get('[data-testid="reservation-date"]').type(new Date().toISOString().split('T')[0]);
    cy.get('[data-testid="reservation-time"]').type('19:00');
    cy.get('[data-testid="table-select"]').click();
    cy.contains('Table 1').click();

    // Verify conflict warning
    cy.contains('Table already reserved for this time').should('be.visible');
  });
}); 