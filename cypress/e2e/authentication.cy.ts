// cypress/e2e/LoginRegister.cy.js

describe('LoginRegister Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/authentication');
    cy.clearLocalStorage();
  });

  describe('UI Elements', () => {
    it('should display the welcome message and initial login form', () => {
      cy.contains('h2', 'Welcome to ChefChecker');
      cy.contains('p', 'Sign in to your account');
      cy.get('button').contains('Login').should('exist');
      cy.get('button').contains('Register').should('exist');
    });

    it('should toggle between login and register forms', () => {
      cy.contains('Sign in to your account');

      // Switch to Register
      cy.get('button').contains('Register').click();
      cy.contains('Create your account');

      // Switch back to Login
      cy.get('button').contains('Login').click();
      cy.contains('Sign in to your account');
    });
  });

  describe("Login Logic", () => {
    it('should show error message for invalid login', () => {
      cy.get('input[type="email"]').type('invalid@email.com');
      cy.get('input[type="password"]').type('wrongpassword');

      cy.get('form button[type="submit"]').click();

      // Check for error message
      cy.get('div').contains('Login failed! please try again later')
          .should('be.visible');

      // Check if fields are cleared after error
      cy.get('input[type="email"]').should('have.value', '');
      cy.get('input[type="password"]').should('have.value', '');
    });

    it('should redirect to main page if login is successful', () => {
      cy.get('input[type="email"]').type('tim@tim.de');
      cy.get('input[type="password"]').type('12345');

      cy.get('form button[type="submit"]').click();

      cy.url().should('eq', `http://localhost:3000/`);

    });
  });

  describe('Register Logic', () => {
    it('should handle successful registration', () => {
      // Switch to register form
      cy.get('button').contains('Register').click();

      cy.get('input[type="text"]').type('newuser');
      cy.get('input[type="email"]').type('newuser@example.com');
      cy.get('input[type="password"]').type('password123');

      cy.get('form button[type="submit"]').click();


    });
  });
});