context('Testing GRAPHQL responses for standards', ()=>{
    const key = Cypress.env('subscription_key')

    it('Responses validations using GraphQL querys',()=> {

        let query = `{
             standards {
                  id
                  name
                  description
                  versionid
                  publishdate
                  name
                  definition
                  version
                  number
                  abstract
                  status              
                  tables {
                      id
                      versionid
                      publishdate
                      name
                      definition
                      version
                      number
                      abstract
                      status
                  }
            }
        }`

        cy.request({
            url: `${Cypress.env('url_prod')}/query`,
            headers: {'Authorization': key},
            qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
            body: {query},
            method: 'POST',
            failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
        }).then((response) => {
            console.log(response)
            const standards = response.body.data.standards
            cy.log(`we found the following standards:`)
            standards.forEach(standard =>{
                cy.log(standard.name)
                expect(standard).to.have.property('id').not.null
                expect(standard).to.have.property('name').not.null
                expect(standard).to.have.property('description').not.null
                expect(standard).to.have.property('versionid')//.not.null       TODO: find out if its ok that only OmniClass has null versionid
                expect(standard.publishdate, "publishdate should match with this format: YYYY-MM-DDT00:00:00")//.to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                expect(standard, "number can't be null").to.have.property("number") //TODO: find out if number can be null, currently its null for UniFormat
                //expect(standard, "title cant be null").to.have.property("title")

                // switch(standard.name){
                //     case "MasterFormat":
                        query = `{
                            standards(id: "${standard.name}"){
                              classifications{
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
                                    haschildren
                                    children{
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
                                       haschildren
                                    }
                                  }
                              }
                            }
                        }`
                    //     break
                    // case "OmniClass":
                    //     query = `{
                    //         standards(id: "${standard.name}"){
                    //           classifications{
                    //               id
                    //               versionid
                    //               publishdate
                    //               number
                    //               title
                    //               alternatetermsabbreviations
                    //               includes
                    //               mayinclude
                    //               doesnotinclude
                    //               notes
                    //               products
                    //               level4numberingrecommendation
                    //               tableref
                    //               synonyms
                    //               discussion
                    //               definitions
                    //               description
                    //               hasparents
                    //               haschildren
                    //               children{
                    //                 id
                    //                 versionid
                    //                 publishdate
                    //                 number
                    //                 title
                    //                 includes
                    //                 mayinclude
                    //                 doesnotinclude
                    //                 notes
                    //                 tableref
                    //                 synonyms
                    //                 discussion
                    //                 haschildren
                    //                 children{
                    //                    id
                    //                    versionid
                    //                    publishdate
                    //                    number
                    //                    title
                    //                    includes
                    //                    mayinclude
                    //                    doesnotinclude
                    //                    notes
                    //                    tableref
                    //                    synonyms
                    //                    discussion
                    //                    haschildren
                    //                 }
                    //               }
                    //           }
                    //         }
                    //     }`
                //}

                cy.request({
                    url: `${Cypress.env('url_prod')}/query`,
                    headers: {'Authorization': key},
                    qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
                    body: {query},
                    method: 'POST',
                    failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
                }).then((response) => {
                    cy.log(`response for standard ${standard.name}`)
                    console.log(`response for standard ${standard.name}`)
                    console.log(response)
                })
            })
        })
    })

})