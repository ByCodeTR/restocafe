describe('Reservation System Flow', () => {
  beforeEach(() => {
    cy.login('staff@example.com', 'password123');
    cy.visit('/reservations');
  });

  it('should create a new reservation', () => {
    cy.get('.new-reservation-button').click();

    // Fill reservation form
    cy.get('input[name="customerName"]').type('John Doe');
    cy.get('input[name="customerPhone"]').type('5551234567');
    cy.get('input[name="guestCount"]').type('4');
    cy.get('input[name="date"]').type('2024-12-25');
    cy.get('input[name="time"]').type('19:00');
    
    // Select table
    cy.get('.available-tables').first().click();
    
    // Submit reservation
    cy.get('.submit-reservation').click();
    cy.get('.reservation-success-message').should('be.visible');
  });

  it('should check table availability', () => {
    cy.get('.check-availability-button').click();
    
    // Enter date and time
    cy.get('input[name="date"]').type('2024-12-25');
    cy.get('input[name="time"]').type('19:00');
    cy.get('input[name="guestCount"]').type('4');
    
    // Check availability
    cy.get('.check-button').click();
    cy.get('.available-tables').should('exist');
  });

  it('should update reservation status', () => {
    // Select first reservation
    cy.get('.reservation-item').first().click();
    
    // Update status
    cy.get('.status-select').select('confirmed');
    cy.get('.update-status').click();
    
    // Verify status update
    cy.get('.reservation-status').should('contain', 'Onaylandı');
  });

  it('should cancel reservation', () => {
    // Select first reservation
    cy.get('.reservation-item').first().click();
    
    // Cancel reservation
    cy.get('.cancel-reservation').click();
    cy.get('.confirm-cancel').click();
    
    // Verify cancellation
    cy.get('.cancellation-success-message').should('be.visible');
  });

  it('should view reservation history', () => {
    cy.get('.view-history-button').click();
    cy.get('.reservation-item').should('have.length.at.least', 1);
    cy.get('.reservation-details').first().should('contain', 'Müşteri');
  });
}); 