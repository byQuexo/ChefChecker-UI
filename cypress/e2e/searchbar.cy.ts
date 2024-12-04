//cypress/e2e/searchbar.ts
describe('Searchbar', () => {
    beforeEach(() => {
      const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC'
      cy.visit('http://localhost:3000');
      cy.intercept('GET', '/api/recipes/search', {
        statusCode: 200,
        body: {
          recipes: [
            { id: 1, title: 'Burger', recipeImage: '' },
          ],
          pagination: {
            currentPage: 1,
            pageSize: 1,
            totalPages: 1,
            totalRecipes: 1,
          },
        },
      }).as('searchBurger');
  
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
  
      //it should allow user to type burger in search bar and enter to search
      cy.get('input').type('burger{enter}');
      
    });
  });
   