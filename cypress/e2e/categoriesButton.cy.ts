// checking when category is selected the apprpriate recipies display

describe('Categories Button', () => {
    beforeEach(() => {
        Cypress.on('uncaught:exception', (err) => {
            console.error('Uncaught exception:', err);
            return false;
          });
        const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC'
        cy.visit('http://localhost:3000');
        //filter for pizza category
        cy.intercept('POST', '/api/recipes/search', {
            statusCode: 200,
            body: {
                recipes: [
                    {
                        id: 'pizza1',
                        title: 'pizza1',
                        recipeImage: mockImage,
                        ingredients: ['ingredients1', 'ingredients12'],
                        instructions: 'instructions1',
                        category: 'Pizza',                    
                        visibility: 'public',
                        userId: '1234',
                    },
                    {
                        id: 'pizza2',
                        title: 'pizza2',
                        recipeImage: mockImage,
                        ingredients: ['ingredients1', 'ingredients12'],
                        instructions: 'instructions1',
                        category: 'Pizza',                    
                        visibility: 'public',
                        userId: '1234',
                    },
                ],
                pagination: {
                    currentPage: 1,
                    pageSize: 8,
                    totalPages: 1,
                    totalRecipes: 1,
                },
            },
        }).as('categoryPizza');
    });

    it('should display pizza when category is selected', () => {
        cy.get('button').contains('Categories').click();
        //select pizza category - the acyaul cateroies isna is open element so we need to click on the button
        cy.get('button').contains('Pizza').click();
        cy.get('div').first().should('contain', 'Pizza');
    });
});