describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should maintain session after page reload', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.contains('Welcome').should('be.visible');
    
    cy.reload();
    cy.contains('Welcome').should('be.visible');
    cy.url().should('include', '/dashboard');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.visit('/dashboard');
    
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();
    
    cy.url().should('include', '/login');
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
}); 