after(()=>{
    cy.clearLocalStorage()
})
Given('A query asking for other versions of a standard', ()=> {
    const query = `{
            standards(id: "MasterFormat") {
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
})
When('I send the request',()=>{

})
Then('I get data for other existing versions of the standard',()=>{

})