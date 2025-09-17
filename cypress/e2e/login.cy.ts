describe('Initial Login tests', () => {
    it('Login with a authorized user', () => {
        //Assert
        cy.visit('http://localhost:3000/login')

        //Act
        cy.get('[data-test="login-input"]').type('1010000')
        cy.get('[data-test="login-submit-button"]').click()
        //Arrange
        cy.url().should('eq', 'http://localhost:3000/')

    })

    it('Login with a unauthorized user', () => {
        //Assert
        cy.visit('http://localhost:3000/login')

        //Act
        cy.get('[data-test="login-input"]').type('unauthorized-user')
        cy.get('[data-test="login-submit-button"]').click()

        //Arrange
        cy.url().should('eq', 'http://localhost:3000/login')
        cy.get('[data-test="login-error-message"]').should('be.visible')
    })

    it('User can Logoff', () => {
        //Assert
        cy.visit('http://localhost:3000/login')
        cy.get('[data-test="login-input"]').type('1010000')
        cy.get('[data-test="login-submit-button"]').click()

        //Act
        cy.get('[data-test="main-user-icon"]').click()
        cy.get('[data-test="main-exit-button"').click()

        //Arrange
        cy.url().should('eq', 'http://localhost:3000/login')

    })
})
