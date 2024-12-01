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
            id: 12345,
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
    cy.intercept('GET', '/api/users/*', {
      statusCode: 200,
      body: {
        user: {
          id: 12345,
          username: 'newuser',
          email: 'newuser@example.com',
          bio: 'twast',
          profileImage: '',
        },
      },
    }).as('fetchUserData');

    // Intercept user update request
    cy.intercept('POST', '/api/users/preferences', (req) => {
      expect(req.body.username).to.equal('updateduser');
      expect(req.body.bio).to.equal('This is my updated bio');
      expect(req.body.email).to.equal('updateduser@example.com');

      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: 12345,
            username: 'updateduser',
            email: 'updateduser@example.com',
            bio: 'This is my updated bio',
            profileImage: '',
          },
        },
      });
    }).as('updateUserData');
  });

  it('should register, navigate to settings, and update user information', () => {
    // Step 1: User Registration
    cy.visit('http://localhost:3000/');
    cy.get('button').contains('Login').click();
    cy.get('button').contains('Register').click();

    cy.get('input[type="text"]').type('newuser');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('form button[type="submit"]').click();

    // Wait for the registration request
    cy.wait('@registerRequest').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(201);
    });

    // Step 2: Navigate to Settings
    cy.visit('http://localhost:3000/settings');
    cy.wait('@fetchUserData').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });

    // Step 3: Update User Information
    cy.get('input[name="Name"]').clear().type('updateduser');
    cy.get('textarea[name="bio"]').clear().type('This is my updated bio'); // Use `textarea` for bio
    cy.get('input[name="email"]').clear().type('updateduser@example.com');

    // Save changes
    cy.get('button').contains('Save Changes').click(); // Ensure button selector matches

    // Wait for the update request
    cy.wait('@updateUserData').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
      expect(interception?.response?.body.user.username).to.equal('updateduser');
      expect(interception?.response?.body.user.bio).to.equal('This is my updated bio');
      expect(interception?.response?.body.user.email).to.equal('updateduser@example.com');
    });

    // Verify UI reflects updated bio
    cy.reload(); // Reload to confirm changes persist
    cy.wait('@fetchUserData');

    // Verify that the updated bio appears in the UI
    cy.get('textarea[name="bio"]').should('have.value', 'This is my updated bio');
    cy.get('input[name="Name"]').should('have.value', 'updateduser');
    cy.get('input[name="email"]').should('have.value', 'updateduser@example.com');
  });
});
