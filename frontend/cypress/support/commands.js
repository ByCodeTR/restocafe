// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

// -- This is a child command --
Cypress.Commands.add('getByTestId', { prevSubject: 'optional' }, (subject, testId) => {
  return subject
    ? subject.find(`[data-testid="${testId}"]`)
    : cy.get(`[data-testid="${testId}"]`);
});

// -- This is a dual command --
Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... }) 