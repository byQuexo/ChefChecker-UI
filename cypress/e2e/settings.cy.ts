describe('User Registration and Settings Update', () => {
  beforeEach(() => {
    // Intercept registration request
    cy.intercept('POST', '/api/auth/register', (req) => {
      expect(req.body.email).to.equal('newuser@example.com');
      expect(req.body.password).to.equal('password123');
      expect(req.body.username).to.equal('newuser');

      req.reply({
        statusCode: 201,
        body: {
          user: {
            id: '12345',
            email: 'newuser@example.com',
            username: 'newuser',
            bio: '',
            profileImage: '',
            preference: {
              darkMode: 'light',
              units: 'metric',
            },
          },
        },
      });
    }).as('registerRequest');

    // Intercept fetch user data
    cy.intercept('GET', '/api/users/*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: '12345',
            username: 'newuser',
            email: 'newuser@example.com',
            bio: 't',
            profileImage: '',
          },
        },
      })
    }).as('fetchUserData');

    // Intercept user update request
    cy.intercept('POST', '/api/users/preferences', (req) => {
      console.log('Intercepted update request:', req);

      expect(req.body.username).to.equal('updateduser');
      expect(req.body.bio).to.equal('This is my updated bio');
      expect(req.body.userId).to.equal('12345');

      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: '12345',
            username: 'updateduser',
            email: 'newuser@example.com',
            bio: 'This is my updated bio',
            profileImage: '',
          },
        },
      });
    }).as('updateUserData');
  });

  it('should register, navigate to settings, and update user information', () => {
    // User Registration
    cy.visit('http://localhost:3000/');
    cy.get('button').contains('Login').click();
    cy.get('button').contains('Register').click();

    cy.get('input[type="text"]').type('newuser');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('form button[type="submit"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(201);
    });

    // Navigate to Settings
    cy.visit('http://localhost:3000/settings');
    cy.wait('@fetchUserData').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });

    // Update User Information
    cy.get('input[type="text"]').clear().type('updateduser');
    cy.get('textarea').clear().type('This is my updated bio');

    cy.contains('button', 'Save Changes').click();

    cy.wait('@updateUserData', { timeout: 10000 }).then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
      expect(interception?.response?.body.user.username).to.equal('updateduser');
      expect(interception?.response?.body.user.bio).to.equal('This is my updated bio');
    });

    cy.wait('@fetchUserData').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(201);
    });

    cy.get('input[type="text"]').should('have.value', 'updateduser');
    cy.get('textarea').should('have.value', 'This is my updated bio');
  });
});