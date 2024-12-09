describe('pagination with img', () =>{
  beforeEach(() =>{
    //use of pre-existing base64 image
    const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC'
    cy.intercept('GET', '/api/recipes/search?page=1', {
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
          totalRecipes: 12,
        },
      },
    }).as('firstPage');

    cy.intercept('GET', '/api/recipes/search?page=2', {
      statusCode: 200,
      body: {
        recipes: [
          {id:9, title:'Pho',recipeImage:mockImage},
          {id:10, title:'Spaghetti',recipeImage:''},
          {id:11, title:'Spaghetti', recipeImage:''},
          {id:12, title:'Spaghetti Bolognese', recipeImage:''},
        ],
        pagination: {
          currentPage: 2,
          pageSize: 8,
          totalPages: 2,
          totalRecipes: 12,
        },
      },
    }).as('secondPage');

    cy.visit('http://localhost:3000');
  });

  it('should display first page', () =>{
    cy.wait('@firstPage'); //wait for first page API response
    //check first image's src
    cy.get('img').first().should('have.attr', 'src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC');

  })

  it('should navigate to second page', () =>{
    cy.wait('@firstPage');
    cy.get('[data-cy="pagination-next"]').click();
    cy.wait('@secondPage');
  })

  it('should navigate back to first page', () =>{
    cy.wait('@firstPage');
    cy.get('[data-cy="pagination-next"]').click();
    cy.wait('@secondPage');

    cy.get('[data-cy="pagination-previous"]').click();
    cy.wait('@firstPage');
  })

  it('should highlight active page button', () =>{
    const currentPage = 2;
    cy.wait('@firstPage');
    cy.get('button').contains(currentPage).click();
    cy.wait('@secondPage');
    cy.get('button').should('contain', currentPage);
    
  })
})