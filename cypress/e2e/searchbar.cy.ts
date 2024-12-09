//cypress/e2e/searchbar.cy.ts
describe('Search Bar', () => {
  const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC';

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });
    cy.visit('http://localhost:3000');

    window.localStorage.setItem('id', '1234');
    window.localStorage.setItem('profilePicture', mockImage);

    cy.intercept('POST', '/api/recipes/search', {
      statusCode: 200,
      body: {
        recipes: [
          {
            id: 'burger',
            title: 'burger',
            recipeImage: mockImage,
            ingredients: ['ingredients1', 'ingredients12'],
            instructions: 'instructions1',
            category: 'Noodles',
            visbility: 'private',
            userId: '1234'
          },
        ],
        pagination: {
          currentPage: 1,
          pageSize: 8,
          totalPages: 1,
          totalRecipes: 1,
        },
      },
    }).as('searchBurger');
  });

  //it should allow user to type burger in search bar and enter to search
  it('should allow user to type burger in search bar and enter to search', () => {
    cy.get('input').type('Burger{enter}');
    cy.wait(5000);
  });

  //it should display burger recipe when burger is searched
  it('should display burger recipe when burger is searched', () => {
    cy.get('input').type('Burger{enter}');
    cy.get('div').first().should('contain', 'burger');
    cy.wait(5000);

  });
});