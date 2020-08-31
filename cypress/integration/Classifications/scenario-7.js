after(()=>{
    cy.clearLocalStorage()
})
Given('A query asking for other versions of a {string} standard', (standard)=> {
    const query = `{
        standards(id: "${standard}", version: null) {
            classifications(number: "46 00 00") {
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
                hasparents
                haschildren
                otherversions {
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
                    }
                }
            }
        }
    }`;
})
When('I send the request',()=>{

})
And('I compare the results with the results querying individually for each version',()=>{

})
Then('I get the same data for other existing versions of the standard',()=>{

})