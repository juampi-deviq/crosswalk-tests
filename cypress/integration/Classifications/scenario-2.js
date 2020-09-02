import 'cypress-localstorage-commands'

after(()=>{
    cy.clearLocalStorage()
})
Given('A query for {string}', (standard)=> {
    const query = `{
        standards(id: "${standard}"){
            classifications{
                id
                versionid
                publishdate
                number
                title
                includes
                haschildren
                children{
                    number
                    title
                }
            }
        }
    }`;
    cy.setLocalStorage('GraphQL_query', JSON.stringify(query))
})
When('I send the request',()=>{
    //const subscription_key = '410ebf3124dc40d29627ba232dfd76ac'
    let query = window.localStorage.getItem('GraphQL_query')
    query= JSON.parse(query)
    cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
    cy.request({
        url: `${Cypress.env('url_dev')}/query`,
        headers: {
            Authorization: Cypress.env("subscription_key")
        },
        qs: {"code": "NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=="},
        body: {query},
        method: 'POST',
        failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
    }).then((response)=>{
        console.log("scenario 2")
        console.log(response)
        cy.setLocalStorage('GraphQL_response',JSON.stringify(response))})
})
Then('I get no errors on children property for classifications but a null children object',()=>{
    var response = JSON.parse(window.localStorage.getItem('GraphQL_response'))
    expect(response.status).to.eq(200)
    const classifications = response.body.data.standards[0].classifications
    cy.log(`Childs listed below`)
    classifications.forEach((classification)=>{
        console.log(classification)
        if(classification.haschildren !== true){
            cy.log(`this classification "${classification.number} " has NO childs `)
        }else{
            classification.children.forEach(child => {
                cy.log(child)
                expect(child).to.have.keys('number','title')
            })

        }
    })
})
