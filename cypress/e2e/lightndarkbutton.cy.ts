// checking the light and dark button

describe('Light and Dark Button', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });


  it('should toggle light to dark', () => {
    cy.get('button').contains('toggle-dark-mode').click();
  });

  it('should toggle dark to light', () => {
    cy.get('button').contains('toggle-dark-mode').click();
  });

});