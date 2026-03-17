describe('Kraft360 - Cypress Fundamentals', () => {
  it('Testing cypress for the first time', () => {
    cy.visit('/')
    expect(true).to.equal(true)
    // cy.get('[data-testid="get-started"]').contains(/Get started by editing/i)
  })
})