// checking the light and dark button

describe('Light and Dark Button', () => {
  it('should toggle light and dark mode', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="light-dark-button"]').click();
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    cy.get('[data-cy="light-dark-button"]').click();
    cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)');
  });
});