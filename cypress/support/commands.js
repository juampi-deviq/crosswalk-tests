
Cypress.Commands.add('getStandards',()=>{
    cy.request({
        url: `${Cypress.config().baseUrl}/api/standards`,
        headers: {'Authorization': Cypress.env('subscription_key')},
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(200)
        return response.body.data.standards
    })
})

Cypress.Commands.add('getTables_OmniClass',()=> {
    cy.request({
        url: `${Cypress.config().baseUrl}/api/standards/OmniClass`,
        headers: {'Authorization':  Cypress.env('subscription_key')},
    }).then((res) => {
        return res.body.data.standards[0].tables    //return OmniClass tables
    })
})