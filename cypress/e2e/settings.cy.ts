describe('User Registration and Settings Update', () => {
  beforeEach(() => {
    // Configure handling of uncaught exceptions
    Cypress.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });

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

    // Intercept fetch user data with dynamic userId
    cy.intercept('GET', '/api/users/12345', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: 12345,
            username: 'updateduser',
            email: 'newuser@example.com',
            bio: 'This is my updated bio',
            profileImage: '',
          },
        },
      });
    }).as('fetchUserData');

    // Intercept user update request
    cy.intercept('POST', '/api/users/preferences', (req) => {
      expect(req.body.username).to.equal('updateduser');
      expect(req.body.bio).to.equal('This is my updated bio');

      req.reply({
        statusCode: 200,
        body: {
          user: {
            id: 12345,
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
    // Step 1: User Registration
    cy.visit('http://localhost:3000/');
    cy.get('button').contains('Login').click();
    cy.get('button').contains('Register').click();

    cy.get('input[type="text"]').type('newuser');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('form button[type="submit"]').click();

    // Wait for the registration request and store user ID in localStorage
    cy.wait('@registerRequest').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(201);
      const userId = interception?.response?.body.user.id;
      window.localStorage.setItem('id', userId.toString());

      // Verify localStorage was set correctly
      cy.window().should((window) => {
        expect(window.localStorage.getItem('id')).to.equal('12345');
      });
    });

    // Step 2: Navigate to Settings and fetch user data using ID from localStorage
    cy.window().then((window) => {
      const userId = window.localStorage.getItem('id');
      cy.visit('http://localhost:3000/settings');

      // Verify the correct endpoint is called with the user ID
      cy.wait('@fetchUserData').then((interception) => {
        expect(interception?.request?.url).to.include(`/api/users/${userId}`);
        expect(interception?.response?.statusCode).to.equal(200);
      });
    });

    // Step 3: Test Components on the Settings Page
    cy.get('input[name="username"]').clear().type('updateduser');
    cy.get('textarea[name="bio"]').clear().type('This is my updated bio');

    // Save changes
    cy.get('button').contains('Save Changes').click();

    // Wait for the update request
    cy.wait('@updateUserData').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
      expect(interception?.response?.body.user.username).to.equal('updateduser');
      expect(interception?.response?.body.user.bio).to.equal('This is my updated bio');
      expect(interception?.response?.body.user.email).to.equal('newuser@example.com');
    });

    // Reload and verify the updated data is displayed
    cy.reload();
    cy.wait('@fetchUserData');

    // Add a small delay to ensure the form is fully populated
    cy.wait(100);

    // Verify that the updated values appear in the UI
    cy.get('textarea[name="bio"]').should('have.value', 'This is my updated bio');
    cy.get('input[name="username"]').should('have.value', 'updateduser');
    cy.get('input[name="email"]').should('have.value', 'newuser@example.com');

    // Verify localStorage still contains userId after all operations
    cy.window().should((window) => {
      expect(window.localStorage.getItem('id')).to.equal('12345');
    });

    // Test Logout and verify localStorage is cleared
    cy.get('button').contains('Log Out').click();
    cy.window().should((window) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(window.localStorage.getItem('id')).to.be.null;
    });
  });
});