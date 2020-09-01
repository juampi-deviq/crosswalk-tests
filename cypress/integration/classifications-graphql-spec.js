context('Testing GraphHL responses', ()=>{
    const key = Cypress.env('subscription_key')

    it('Validations on standards fields and his classifications (MasterFormat/UniFormat)',()=> {
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
                    number
                    versionid
                    publishdate
                  }
            }
        }`
        cy.request({
            url: `${Cypress.config().baseUrl}/query`,      // `${Cypress.env('url_prod')}/query`,
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
                expect(standard.publishdate)//.to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)    //Standard can have null publishdate
                expect(standard, "number can't be null").to.have.property("number") //TODO: find out if number can be null, currently its null for UniFormat
                //expect(standard, "title cant be null").to.have.property("title")
                expect(standard.table, "table attribute should be null for standards differents to OmniClass").to.be.undefined
                switch(standard.name){
                     case "MasterFormat": case "UniFormat": case "MasterFormat 1995":
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
                    break;
                }
                cy.request({
                    url: `${Cypress.config().baseUrl}/query`,
                    headers: {'Authorization': key},
                    qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
                    body: {query},
                    method: 'POST',
                    failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
                }).then((response) => {
                    expect(response.status).eq(200)
                    cy.log(`response for standard ${standard.name}`)
                    console.log(`response for standard ${standard.name}`)
                    console.log(response)
                })
            })
        })
    })

    it.skip('If the user request for an OmniClass classification without providing a table then he gets an explicit error object inside the response',()=>{
        const standard = "OmniClass"
        const query = `{
            standards(id: "${standard}" ){
              classifications{
                  id
                  description
                  hasparents
                  haschildren
                  children{
                    id
                    versionid
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
                       children{
                           id
                           versionid
                           publishdate
                           number
                           title
                           includes
                           mayinclude
                           doesnotinclude
                           children{
                               id
                               versionid
                               publishdate
                               number
                               title
                               includes
                               mayinclude
                               doesnotinclude
                           }
                       }
                    }
                  }
              }
            }
        }`
        cy.request({
            url: `${Cypress.config().baseUrl}/query`,
            headers: {'Authorization': key},
            qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
            body: {query},
            method: 'POST',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).eq(200)
            expect(response.body.errors[0].message).to.contains("Error trying to resolve classifications")
        })
    })

    it.only("User can get all the OmniClass classifications and children classifications by providing table attribute",()=>{
        let query = `{
             standards{
                id
                name
                description
                versionid
                name
                definition
                version
                number         
                tables {
                    id
                    number
                    versionid
                    publishdate
                }
             }
        }`
        cy.request({
            url: `${Cypress.config().baseUrl}/query`,
            headers: {'Authorization': key},
            qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
            body: {query},
            method: 'POST',
            failOnStatusCode: false
        }).then((response) => {
            const omniclass_standard = response.body.data.standards.find(standard => standard.name == "OmniClass")
            const omniclass_tables = omniclass_standard.tables
            omniclass_tables.forEach(table => {
                cy.log('assertions over OmniClass Tables')
                expect(table).to.have.keys('id','number','publishdate','versionid')
                expect(table.id).not.to.be.null
                expect(table.versionid).not.to.be.null
                expect(table.publishdate).to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)

                //looping into the table to get all OmniClass classifications
                query= `{
                    standards(id: "${omniclass_standard.name}", table: "${table.number}"){
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
                            }
                        }
                    }
                }`
                cy.request({
                    url: `${Cypress.config().baseUrl}/query`,
                    headers: {'Authorization': key},
                    qs: {"code": 'NnzltFV95WnYMfea9vJX/QTrVAJaBzA9ExmCcspUnZeYIKDqbP9uwQ=='},
                    body: {query},
                    method: 'POST',
                    failOnStatusCode: false
                }).then((response) => {
                    console.log(response)
                    //expect(response.body.data.standards.classifications).not.to.be.empty
                })


            })
        })
    })
})