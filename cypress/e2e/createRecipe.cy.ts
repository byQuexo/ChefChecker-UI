/// <reference types="cypress" />

describe('New Recipe Page Tests', () => {
  beforeEach(() => {

    cy.intercept('POST', '/api/recipes/create', {
      statusCode: 201,
      body: { success: true },
    }).as('createRecipe');
  });

  it('should allow the user to fill out the form and submit a new recipe', () => {
 
    localStorage.setItem('id', 'test-user-id');
    localStorage.setItem('darkMode', 'false');

   
    cy.visit('localhost:3000/recipes/create');

    
    cy.get('input[placeholder="Enter recipe title"]').type('Test Recipe Title');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC',
        'base64'
      ),
      fileName: 'test-image.png',
    });
    cy.get('img[alt="Recipe Preview"]').should('be.visible');
    cy.get('textarea[placeholder="Enter ingredients, separated by commas"]').type(
      'Ingredient 1, Ingredient 2, Ingredient 3'
    );
    cy.get('textarea[placeholder="Enter step-by-step instructions"]').type(
      'Step 1: Do this\nStep 2: Do that\nStep 3: Serve'
    );

    cy.get('select').first().select('Pizza');
    cy.get('select').last().select('Private');
    cy.get('button').contains('Create Recipe').click();
    cy.wait('@createRecipe');
    cy.url().should('eq', `http://localhost:3000/`);
  });

  it('should redirect unauthenticated users to /authentication', () => {
    localStorage.removeItem('id');
    cy.visit('localhost:3000/recipes/create');
    cy.url().should('eq', 'http://localhost:3000/authentication');
  });
});
