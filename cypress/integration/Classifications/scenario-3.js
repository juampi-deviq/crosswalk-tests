import 'cypress-localstorage-commands'

after(()=>{
    cy.clearLocalStorage()
})
Given('A query for {string} standard without specific classifications and version', (standard)=> {
    const query = `{
        standards(id: "${standard}", version: null){
            classifications{
                id
                publishdate
                versionid
                number
                haschildren
                children {
                    id
                    versionid
                    publishdate
                    number
                    title
                    includes
                    mayinclude
                    doesnotinclude
                    notes
                    tableref
                    synonyms
                    discussion
                }
            }
        }
    }`;
    cy.setLocalStorage('GraphQL_query', JSON.stringify(query))
})
When('I send the rest request',()=>{
    //const subscription_key = '410ebf3124dc40d29627ba232dfd76ac'
    let query = window.localStorage.getItem('GraphQL_query')
    query= JSON.parse(query)
    cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
    cy.request({
        url: `${Cypress.env('url_dev')}/query`,
        //headers: {auth: subscription_key,},
        qs: {"code": "NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=="},
        body: {query},
        method: 'POST',
        failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
    }).then((response)=>{
        expect(response.status).eq(200)
        cy.setLocalStorage('GraphQL_response',JSON.stringify(response))})
})
Then('I get all the available classifications and his child',()=>{
    var response = window.localStorage.getItem('GraphQL_response')
    response = JSON.parse(response)
    const standards = response.body.data.standards[0]
    expect(response.status).to.eq(200)
    expect(standards).to.have.key("classifications")
    //expect(standards.classifications[0]).to.have.property("number").eq(classification)
    expect(standards.classifications[0]).to.have.property("id").not.to.be.null
    expect(standards.classifications[0]).to.have.property("versionid").not.to.be.null
    expect(standards.classifications[0]).to.have.property("publishdate").not.to.be.null
    const childrens = standards.classifications[0].children
    //expect(childrens).to.have.lengthOf(14)


    cy.log(`List of children for :`)
    childrens.forEach((children)=>{
        expect(children).to.have.all.keys("discussion", "doesnotinclude", "id", "includes", "mayinclude", "notes", "number", "publishdate", "synonyms", "tableref", "title")
        expect(children, "child id never can be null").to.have.property("id").not.to.be.null
        expect(children, "versionid can't be null").to.have.property("versionid").not.to.be.null
        expect(children.publishdate, "publishdate should match with this format: YYYY-MM-DDT00:00:00").to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
        expect(children, "number can't be null").to.have.property("number").not.to.be.null
        expect(children, "title cant be null").to.have.property("title").not.to.be.null
        expect(children).to.have.property("includes")//.not.to.be.null
        cy.log(children.number)
    })
})
