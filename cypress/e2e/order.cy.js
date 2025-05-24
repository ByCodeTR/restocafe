describe('Order Management Flow', () => {
  beforeEach(() => {
    // Login as waiter
    cy.login('waiter@example.com', 'password123');
    cy.visit('/tables');
  });

  it('should create a new order', () => {
    // Select a table
    cy.get('.table-item').first().click();
    cy.get('.new-order-button').click();

    // Add items to order
    cy.get('.menu-category').first().click();
    cy.get('.menu-item').first().click();
    cy.get('.quantity-input').type('2');
    cy.get('.add-to-order').click();

    // Submit order
    cy.get('.submit-order').click();
    cy.get('.order-success-message').should('be.visible');
  });

  it('should update order status', () => {
    // Go to active orders
    cy.visit('/orders/active');
    
    // Select first order
    cy.get('.order-item').first().click();
    
    // Update status
    cy.get('.status-select').select('preparing');
    cy.get('.update-status').click();
    
    // Verify status update
    cy.get('.order-status').should('contain', 'Hazırlanıyor');
  });

  it('should add payment to order', () => {
    // Go to active orders
    cy.visit('/orders/active');
    
    // Select first order
    cy.get('.order-item').first().click();
    
    // Add payment
    cy.get('.add-payment-button').click();
    cy.get('.payment-amount').type('100');
    cy.get('.payment-type').select('cash');
    cy.get('.submit-payment').click();
    
    // Verify payment added
    cy.get('.payment-success-message').should('be.visible');
  });

  it('should view order history', () => {
    cy.visit('/orders/history');
    cy.get('.order-item').should('have.length.at.least', 1);
    cy.get('.order-details').first().should('contain', 'Toplam');
  });
}); 