describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show error on invalid login', () => {
    cy.get('input[name="email"]').type('invalid@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('.user-profile').should('exist');
  });

  it('should logout successfully', () => {
    // Login first
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Then logout
    cy.get('.logout-button').click();
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
}); 