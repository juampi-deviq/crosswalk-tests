import 'cypress-localstorage-commands'

after(()=>{
    cy.clearLocalStorage()
})
Given('A query for children of OmniClass and his subchildren', ()=> {
    const query = `{
        standards(id: "OmniClass", table:"22") {
          otherversions{id}
          classifications {
               id
               versionid
               publishdate
               number
               title
               alternatetermsabbreviations
               includes
               mayinclude
               doesnotinclude
               notes
               products
               level4numberingrecommendation
               tableref
               synonyms
               discussion
               definitions
               description
               hasparents
               haschildren
               children{
                number
                children{hasparents}
               }
               otherversions{
                number
                title
                children{number}
               }
          }
     }
    }`;
    cy.setLocalStorage('GraphQL_query', JSON.stringify(query))
})
When('I send the request',()=>{
    let query = window.localStorage.getItem('GraphQL_query')
    query= JSON.parse(query)
    cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
    cy.request({
        url: `${Cypress.env('url_dev')}/query`,
        qs: {"code": Cypress.env('crosswalk_key')},
        body: {query},
        method: 'POST',
        timeout: 85000,
        failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
    }).then((response)=>{
        console.log(response)
        cy.setLocalStorage('GraphQL_response',JSON.stringify(response))})
})
Then('I get valid data for children and subchildren classifications across standard versions',()=>{
    var response = window.localStorage.getItem('GraphQL_response')
    response = JSON.parse(response)
    const standards = response.body.data.standards[0]
    expect(response.status).to.eq(200)
    expect(standards).to.contains.key("classifications").not.to.be.empty
})
