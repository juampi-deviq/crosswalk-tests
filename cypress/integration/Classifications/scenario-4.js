import 'cypress-localstorage-commands'

after(()=>{
    cy.clearLocalStorage()
})
Given('A query for children of {string} and his subchildren', (standard)=> {
    const query = `{
        standards(id: "${standard}", version: null){
            classifications{
                id
                publishdate
                number
                haschildren
                versionid
                title
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
        //headers: {auth: subscription_key,},
        qs: {"code": Cypress.env('crosswalk_key')},
        body: {query},
        method: 'POST',
        timeout: 500000,
        failOnStatusCode: false  // not a must but in case the fail code is not 200 / 400
    }).then((response)=>{
        console.log(response)
        cy.setLocalStorage('GraphQL_response',JSON.stringify(response))})
})
Then('I get valid data for children and subchildren classifications',()=>{
    var response = window.localStorage.getItem('GraphQL_response')
    response = JSON.parse(response)
    const standards = response.body.data.standards[0]
    expect(response.status).to.eq(200)
    expect(standards).to.have.key("classifications")
    //expect(standards.classifications[0]).to.have.property("number").eq(classification)
    const classifications = standards.classifications
    classifications.forEach(classification =>{
        expect(classification).to.have.property("id").not.to.be.null
        expect(classification).to.have.property("versionid").not.to.be.null
        expect(classification).to.have.property("publishdate").not.to.be.null
        expect(classification).to.have.property("title").not.to.be.null
        let childrens = classification.children
        cy.log(`List of children for ${classification.number}: `)
        childrens.forEach((children)=>{
            expect(children, "child id never can be null").to.have.property("id").not.to.be.null
            expect(children, "versionid can't be null").to.have.property("versionid").not.to.be.null
            expect(children.publishdate, "publishdate should match with this format: YYYY-MM-DDT00:00:00").to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
            expect(children, "number can't be null").to.have.property("number").not.to.be.null
            expect(children, "title cant be null").to.have.property("title").not.to.be.null
            expect(children).to.have.property("includes")//.not.to.be.null
            if(children.haschildren === true){
                var subchildren = children.children
                //expect(subchildren).not.to.be.empty
                if(subchildren.haschildren === true){
                    var sub_subchildren = subchildren.children
                    expect(sub_subchildren).not.to.be.empty
                    if(sub_subchildren.haschildren === true){
                        expect(sub_subchildren.children).not.to.be.undefined
                    }else{
                        expect(sub_subchildren.children).to.be.undefined
                    }
                }else{
                    expect(subchildren.children).to.be.undefined
                }
            }
            cy.log(children.number)
        })
    })

})
