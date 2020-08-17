context('Testing REST responses for standards', ()=>{
    const key = Cypress.env('subscription_key')

    it('Using invalid token throws an 401 HTTP error code',()=> {
        const standard = 'MasterFormat'
        const classification = '54 00 00'
        const rest_url = `https://api.crosswalk.digital/v2.1/api/standards/${standard}/classifications/${classification}`
        cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
        cy.request({
            headers: {'Authorization': 'not_valid_api_key'},
            url: rest_url,
            failOnStatusCode: false
        }).then((response) => {
            console.log(response)
            expect(response.status).to.eq(401)
            expect(response.statusText, "exception message should be unauthorized").eq("Unauthorized")
        })
    })

    //https://csi-crosswalk-dev.azurewebsites.net/api/standards/MasterFormat
    it('Validations getting standars',()=> {
        const rest_url = `https://api.crosswalk.digital/v2.1/api/standards`
      //cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
        cy.request({
            url: rest_url,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response) => {
            console.log(response)
            expect(response.status).to.eq(200)
        })
    })


    it('Using bad formed request url throws an 400 error code',()=> {
        const standard = 'MasterFormat'
        const rest_url = `https://api.crosswalk.digital/v2.1/api/standards/${standard}/classif/any` //its "classifications" not classification
        cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
        cy.request({
            headers: {'Authorization': key},
            url: rest_url,
            qs: {code: key},
            failOnStatusCode: false
        }).then((response) => {
            console.log(response)
            expect(response.status, "a bad request code (400) its expected here").to.eq(400)
            expect(response.statusText, "exception message should be 'bad request'").eq("Bad Request")
        })
    })

    it('Querying for non-valid standard throws an 404 error code',()=> {
        const standard = 'Fender'
        const classification = 'telecaster'
        const rest_url = `https://api.crosswalk.digital/v2.1/api/standards/${standard}/classifications/${classification}`
        cy.setCookie('ARRAffinity', '4c447c85abb5ea1d861abc88798fc669b357ca55cedef5fbab4c723c1f9a8b24')
        cy.request({
            headers: {'Authorization': key},
            url: rest_url,
            qs: {code: key},
            failOnStatusCode: false
        }).then((response) => {
            console.log(response)
            expect(response.status, "A 404 code (not fount) its expected here").to.eq(404)
            expect(response.statusText, "exception message should be 'not found'").eq("Not Found")

        })
    })
})