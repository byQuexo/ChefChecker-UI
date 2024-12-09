// checking the light and dark button

describe('Light and Dark Button', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });


  it('should toggle light to dark and vice versa', () => {
    cy.get('button').first().click();
    cy.wait(5000);
    cy.get('button').first().click();
  });


});