describe('My Recipes Button', () =>{
  const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC' 
  
  beforeEach(() =>{

    Cypress.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });

    cy.visit('http://localhost:3000');

    window.localStorage.setItem('id', '1234');
    window.localStorage.setItem('profilePicture', mockImage);

    cy.intercept('POST', 'api/recipes/search', (req) =>{
      expect(req.body).to.have.property('opts');
      expect(req.body.opts).to.have.property('userId', '1234');
      req.reply({
          statusCode: 200,
          body: {
            recipes: [
              {
                id: 'recipe1',
                title: 'recipe1',
                recipeImage: mockImage,
                ingredients: ['ingredients1', 'ingredients12'],
                instructions: 'instructions1',
                category: 'Noodles',
                visbility: 'private',
                userId: '1234'
              },
              {
                id: 'recipe2',
                title: 'recipe2',
                recipeImage: mockImage,
                ingredients: ['ingredients12', 'ingredients10'],
                instructions: 'instructions11',
                category: 'Salad',
                visbility: 'private',
                userId: '1234'
              }
            ],
            pagination: {
              currentPage: 1,
              pageSize: 8,
              totalPages: 1,
              totalRecipes: 2
            }
          }
      })        
    }).as('myRecipes');
     
  });

  it('should display my recipes button and my recipes list when user is logged in', () =>{ 
    cy.get('[data-testid="myrecipe-button"]').contains('My Recipes').should('be.visible');
    cy.get('[data-testid="myrecipe-button"]').click();

    cy.wait('@myRecipes').then((interception) =>{
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get('[data-testid="recipe-list"]').should('be.visible');
    cy.get('[data-testid="recipe-list"]').should('have.length', 2);
   

  });
    
  it('should not dispaly my recipes button', () =>{
    cy.window().then((win) =>{
      win.localStorage.removeItem('id');
    });
    
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="myrecipe-button"]').should('not.exist');
  });
})