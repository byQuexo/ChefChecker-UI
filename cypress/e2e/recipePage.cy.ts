// Cypress tests for Recipe Page with API mocking
/// <reference types="cypress" />

describe('Recipe Page Tests', () => {
  const recipeId = 'sample-recipe-id'; 

  beforeEach(() => {

    localStorage.setItem('id', 'test-user-id');


    cy.intercept('GET', `/api/recipes/${recipeId}`, {
      statusCode: 200,
      body: {
        recipe: {
          recipeId,
          title: 'Test Recipe Title',
          userId: 'test-user-id',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          instructions: 'Step 1\nStep 2',
          visibility: 'public',
          comments: []
        }
      }
    }).as('getRecipe');

    cy.intercept('PATCH', '/api/recipes/update', {
      statusCode: 200,
      body: {
        success: true
      }
    }).as('updateRecipe');

    cy.intercept('POST', '/api/recipes/comments/add', {
      statusCode: 201,
      body: {
        success: true
      }
    }).as('addComment');

    cy.intercept('POST', '/api/recipes/comments/delete', {
      statusCode: 200,
      body: {
        success: true
      }
    }).as('deleteComment');

    cy.visit(`localhost:3000/recipes/${recipeId}`);
    cy.wait('@getRecipe');
  });

  it('should allow logged in user to edit the recipe title', () => {

    cy.get('[data-testid="edit-title-button"]').click();

    // Edit the title in the modal
    cy.get('[data-testid="edit-title-textarea"]').clear().type('Updated Recipe Title');
    cy.get('[data-testid="save-button"]').click();

   
    cy.wait('@updateRecipe');
    cy.get('[data-testid="recipe-title"]').should('contain', 'Updated Recipe Title');
  });

  it('should allow logged in user to add a comment', () => {
      cy.get('[data-testid="add-comment-textarea"]').type('This is a test comment');


    cy.get('[data-testid="add-comment-button"]').click();

   
    cy.wait('@addComment');
    cy.get('[data-testid="comments-section"]').should('contain', 'This is a test comment');
  });

  it('should allow logged-in user to delete their own comment', () => {
    // Add a new comment to delete
    cy.get('[data-testid="add-comment-textarea"]').type('Comment to delete');
    cy.get('[data-testid="add-comment-button"]').click();
  

    cy.wait('@addComment');

    cy.contains('Comment to delete')
      .should('be.visible')
      .parent() 
      .parent()
      .within(() => {
        // Wait for the delete button to be rendered dynamically
        cy.get('#deleteComment', { timeout: 10000 })
          .should('be.visible')
          .click(); 
      });
  
   
    cy.wait('@deleteComment');
  
    cy.get('[data-testid="comments-section"]').should('not.contain', 'Comment to delete');
  });
  
  

  it('should not allow a non-owner to edit the recipe', () => {

    localStorage.setItem('id', 'different-user-id');
    cy.visit(`localhost:3000/recipes/${recipeId}`);
    cy.wait('@getRecipe');

    
    cy.get('[data-testid="edit-title-button"]').should('not.exist');
  });

  afterEach(() => {
   
    localStorage.removeItem('id');
  });
});