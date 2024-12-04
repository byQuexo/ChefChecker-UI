// checking when category is selected the apprpriate recipies display

describe('Categories Button', () => {
    beforeEach(() => {
        const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC'
        cy.visit('http://localhost:3000');
        cy.intercept('GET', '/api/recipes/search', {
        statusCode: 200,
        body: {
            recipes: [
            {id:1, title:'Egg-Fried Noodles', recipeImage:mockImage},
            {id:2, title:'Burger', recipeImage:''},
            {id:3, title:'Caesar Salad', recipeImage:''},
            {id:4, title:'Chicekn Curry', recipeImage:''},
            {id:5, title:'Chocolate Chip Cookies', recipeImage:''},
            {id:6, title:'Lasagna', recipeImage:''},
            {id:7, title:'Margarita Pizza', recipeImage:''},
            {id:8, title:'Pancakes', recipeImage:''},
            ],
            pagination: {
            currentPage: 1,
            pageSize: 8,
            totalPages: 2,
            totalRecipes: 8,
            },
        },
        }).as('searchPizza');
    });
    
    it('should display recipes when category is selected', () => {
        cy.get('[data-cy="categories-button"]').click();
        cy.get('[data-cy="categories-dropdown"]').select('Italian');
        cy.get('[data-cy="categories-dropdown"]').should('have.value', 'Italian');
        cy.get('[data-cy="categories-dropdown"]').select('All');
        cy.get('[data-cy="categories-dropdown"]').should('have.value', 'All');
    });
});