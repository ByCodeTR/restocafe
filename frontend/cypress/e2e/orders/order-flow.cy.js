describe('Order Flow', () => {
  beforeEach(() => {
    cy.login('waiter@example.com', 'password123');
    cy.visit('/dashboard/orders');
  });

  it('should create a new order', () => {
    // Create test data
    cy.createTestTable();
    cy.createTestProduct();

    // Start new order
    cy.get('[data-testid="new-order-btn"]').click();

    // Select table
    cy.get('[data-testid="table-select"]').click();
    cy.contains('Table 1').click();

    // Add items
    cy.get('[data-testid="add-item-btn"]').click();
    cy.get('[data-testid="product-select"]').click();
    cy.contains('Test Product').click();
    cy.get('[data-testid="quantity-input"]').clear().type('2');
    cy.get('[data-testid="add-item-confirm"]').click();

    // Submit order
    cy.get('[data-testid="submit-order"]').click();

    // Verify order created
    cy.contains('Order created successfully').should('be.visible');
    cy.contains('Test Product').should('be.visible');
    cy.contains('2x').should('be.visible');
  });

  it('should update order status', () => {
    // Create test order
    cy.createTestOrder();

    // Find order in list
    cy.contains('Table 1').should('be.visible');
    
    // Update status
    cy.get('[data-testid="order-status-btn"]').click();
    cy.contains('PREPARING').click();

    // Verify status updated
    cy.contains('Status updated').should('be.visible');
    cy.contains('PREPARING').should('be.visible');
  });

  it('should add items to existing order', () => {
    // Create test order
    cy.createTestOrder();
    cy.createTestProduct({
      name: 'Additional Item',
      price: 15.99,
      categoryId: '1',
    });

    // Find and edit order
    cy.get('[data-testid="edit-order-btn"]').first().click();

    // Add new item
    cy.get('[data-testid="add-item-btn"]').click();
    cy.get('[data-testid="product-select"]').click();
    cy.contains('Additional Item').click();
    cy.get('[data-testid="quantity-input"]').clear().type('1');
    cy.get('[data-testid="add-item-confirm"]').click();

    // Save changes
    cy.get('[data-testid="save-changes"]').click();

    // Verify new item added
    cy.contains('Order updated successfully').should('be.visible');
    cy.contains('Additional Item').should('be.visible');
    cy.contains('1x').should('be.visible');
  });

  it('should complete order payment', () => {
    // Create test order
    cy.createTestOrder();

    // Process payment
    cy.get('[data-testid="process-payment-btn"]').first().click();
    cy.get('[data-testid="payment-amount"]').should('be.visible');
    cy.get('[data-testid="payment-method-select"]').click();
    cy.contains('Cash').click();
    cy.get('[data-testid="confirm-payment"]').click();

    // Verify payment completed
    cy.contains('Payment processed successfully').should('be.visible');
    cy.contains('PAID').should('be.visible');
  });

  it('should handle order cancellation', () => {
    // Create test order
    cy.createTestOrder();

    // Cancel order
    cy.get('[data-testid="cancel-order-btn"]').first().click();
    cy.get('[data-testid="cancel-reason"]').type('Customer changed mind');
    cy.get('[data-testid="confirm-cancel"]').click();

    // Verify cancellation
    cy.contains('Order cancelled successfully').should('be.visible');
    cy.contains('CANCELLED').should('be.visible');
  });
}); 