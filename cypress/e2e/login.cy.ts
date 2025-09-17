describe('Initial Login tests', () => {

    beforeEach(() => {
        //Arrange
        cy.visit('http://localhost:3000/login')

    })

    it('Login with a authorized user', () => {
        //Act
        cy.get('[data-test="login-input"]').type('1010000')
        cy.get('[data-test="login-submit-button"]').click()
        //Arrange
        cy.url().should('eq', 'http://localhost:3000/')

        cy.screenshot('Sucessful login')

    })

    it('Login with a unauthorized user', () => {

        //Act
        cy.get('[data-test="login-input"]').type('unauthorized-user')
        cy.get('[data-test="login-submit-button"]').click()

        //Assert
        cy.url().should('eq', 'http://localhost:3000/login')
        cy.get('[data-test="login-error-message"]').should('be.visible')

        cy.screenshot('Login error')
    })

    it('User can Logoff', () => {

        //Assert
        cy.get('[data-test="login-input"]').type('1010000')
        cy.get('[data-test="login-submit-button"]').click()

        //Act
        cy.get('[data-test="main-user-icon"]').click()
        cy.screenshot('Logoff button')

        cy.get('[data-test="main-exit-button"').click()


        //Assert
        cy.url().should('eq', 'http://localhost:3000/login')

    })
})
