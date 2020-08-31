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
    it.skip('Validations requesting all standards in the same request',()=> {
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response) => {
            console.log(response)
            expect(response.status).to.eq(200)

            const standards = response.body.data.standards
            cy.log(`we found the following standards:`)
            standards.forEach(standard =>{
                cy.log(standard.name)
                expect(standard, "standard should contain property 'definition'").to.have.property('definition')//.not.null
                expect(standard, "standard should contain property 'description' not null").to.have.property('description').not.null
                expect(standard, "standard should contain property 'id' not null").to.have.property('id').not.null
                expect(standard, "standard should contain 'name' not null").to.have.property('name').not.null
                expect(standard.publishdate, "standard should contain property 'publishdate")    //.to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)    //Standard can have null publishdate
                expect(standard, "standard should contain property 'version'").to.have.property('version')//.not.null
                expect(standard, "standard should contain property 'versionid'").to.have.property('versionid')//.not.null       TODO: find out if its ok that only OmniClass has null versionid
            })
        })
    })

    it.skip('Validations requesting for all standards one-by-one',()=> {
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            const standards = response.body.data.standards
            standards.forEach(standard => {
                cy.request({
                    url: `${Cypress.config().baseUrl}/api/standards/${standard.name}`,
                    headers: {'Authorization': key},
                    failOnStatusCode: false
                }).then((response) => {
                    console.log(response)
                    expect(response.status).to.eq(200)
                    const standard = response.body.data.standards[0]
                    cy.log(standard.name)
                    expect(standard, "standard should contain property 'definition'").to.have.property('definition')//.not.null
                    expect(standard, "standard should contain property 'description' not null").to.have.property('description').not.null
                    expect(standard, "standard should contain property 'id' not null").to.have.property('id').not.null
                    expect(standard, "standard should contain 'name' not null").to.have.property('name').not.null
                    expect(standard.publishdate, "standard should contain property 'publishdate")    //.to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)    //Standard can have null publishdate
                    expect(standard, "standard should contain property 'version'").to.have.property('version')//.not.null
                    expect(standard, "standard should contain property 'versionid'").to.have.property('versionid')//.not.null       TODO: find out if its ok that only OmniClass has null versionid
                })
            })
        })
    })

    it.skip('Validations requesting for specific different standard versions',()=> {
        const standard= "MasterFormat"
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards/${standard}`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response1) => {
            expect(response1.status).to.eq(200)
            const otherversions= response1.body.data.standards[0].otherversions
            otherversions.forEach(otherVersion =>{
                cy.request({
                    url: `${Cypress.config().baseUrl}/api/standards/${standard}/version/${otherVersion.version}`,
                    headers: {'Authorization': key},
                    failOnStatusCode: false
                }).then((response2) => {
                    expect(response1.body.data.standards[0]).to.not.eql(response2.body.data.standards[0])
                })
            })
        })
    });

    it.skip('Requesting for an standard always implicitly make reference to the last version by default',()=> {
        const standard= "MasterFormat"
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards/${standard}`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response1) => {
            expect(response1.status).to.eq(200)
            cy.request({
                url: `${Cypress.config().baseUrl}/api/standards/${standard}/version/2018`,
                headers: {'Authorization': key},
                failOnStatusCode: false
            }).then((response2) => {
                expect(response1.body.data.standards[0]).to.eql(response2.body.data.standards[0])
            })
        })
    })

    it('Validations on response for standards from all OmniClass tables',()=>{
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards/OmniClass`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200)
            const omniclass_tables = res.body.data.standards[0].tables
            omniclass_tables.forEach(table => {
                cy.request({
                    url: `${Cypress.config().baseUrl}/api/standards/OmniClass/table/${table.number}`,
                    headers: {'Authorization': key},
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log(`OmniClass - table ${table.number}: "${response.body.data.standards[0].definition}"`)
                    expect(response.body.data.standards[0]).to.have.keys("abstract", "definition", "description", "id", "name", "number", "otherversions", "publishdate", "status", "tableid", "tables", "version", "versionid")
                    expect(response.body.data.standards[0].description).to.be.not.null
                    expect(response.body.data.standards[0].id).to.be.not.null
                    expect(response.body.data.standards[0].name).to.be.eq("OmniClass")
                })
            })
        })
    })

    it.skip('Validations requesting for classifications for each standard',()=>{
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            const standards = response.body.data.standards
            standards.forEach(standard => {
                switch (standard.name) {
                    case "MasterFormat": case "UniFormat": case "MasterFormat 1995":
                        cy.request({
                            url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/classifications`,
                            headers: {'Authorization': key},
                            failOnStatusCode: false
                        }).then((res) => {
                            console.log(res)
                            expect(res.status).to.eq(200)
                            const standard = res.body.data.standards[0]
                            cy.log(standard.name)
                            expect(standard, "response should contains 'classifications'").to.have.property('classifications')//.not.null
                            let classifications =  standard.classifications
                            classifications.forEach((classification)=>{
                                expect(classification).to.have.property('discussion')//.not.null
                                expect(classification).to.have.property('doesnotinclude')//.not.null
                                expect(classification).to.have.property('id').not.null
                                expect(classification).to.have.property('includes')//.not.null
                                expect(classification).to.have.property('mayinclude')//.not.null
                                expect(classification).to.have.property('notes')//.not.null
                                expect(classification).to.have.property('number')//.not.null    //TODO: verificar si esto debe ser nulo o no, para mi nunca debe ser NULL!
                                if(!classification.number) cy.log(" 🔔 null number for classification found")
                                expect(classification).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                expect(classification).to.have.property('synonyms')//.not.null
                                expect(classification).to.have.property('tableref')//.not.null
                                expect(classification).to.have.property('title').not.null
                                expect(classification).to.have.property('versionid').not.null
                            })
                        })
                    break;
                    case "OmniClass":
                        cy.request({
                            url: `${Cypress.config().baseUrl}/api/standards/${standard.name}`,      //this is needed to get "OmniClass Tables"
                            headers: {'Authorization': key},
                            failOnStatusCode: false
                        }).then((res) => {
                            const omniclass_tables = res.body.data.standards[0].tables
                            cy.log("now getting classifications for each OmniClass Table......")
                            omniclass_tables.forEach(table => {
                                cy.request({
                                    url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/table/${table.number}/classifications`,
                                    headers: {'Authorization': key},
                                    failOnStatusCode: false
                                }).then((response) => {
                                    console.log(response)
                                    expect(response.status).to.eq(200)
                                    const standard = response.body.data.standards[0]
                                    let classifications =  standard.classifications
                                    classifications.forEach((classification)=>{
                                        expect(classification).to.have.keys('discussion','doesnotinclude','id','includes','mayinclude','notes','number','publishdate','synonyms','tableref','title','versionid')
                                        expect(classification).to.have.property('discussion')//.not.null
                                        expect(classification).to.have.property('doesnotinclude')//.not.null
                                        expect(classification).to.have.property('id').not.null
                                        expect(classification).to.have.property('includes')//.not.null
                                        expect(classification).to.have.property('mayinclude')//.not.null
                                        expect(classification).to.have.property('notes')//.not.null
                                        expect(classification).to.have.property('number').not.null
                                        expect(classification).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                        expect(classification).to.have.property('synonyms')//.not.null
                                        expect(classification).to.have.property('tableref')//.not.null
                                        expect(classification).to.have.property('title').not.null
                                        expect(classification).to.have.property('versionid').not.null
                                    })
                                })
                            })
                        })
                    break;
                }
            })
        })
    })

    it('Validations requesting for Classifications With Relations for all standards',()=>{
        var count = 0
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards`,
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            let standards = response.body.data.standards
            standards.forEach(standard => {
                switch (standard.name) {
                    case "OmniClass":
                        cy.request({
                            url: `${Cypress.config().baseUrl}/api/standards/${standard.name}`,      //this is needed to get "OmniClass Tables"
                            headers: {'Authorization': key},
                            failOnStatusCode: false
                        }).then((res) => {
                            const omniclass_tables = res.body.data.standards[0].tables
                            cy.log("now getting classifications for each OmniClass Table......")
                            omniclass_tables.forEach(table => {
                                cy.request({
                                    url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/table/${table.number}/classifications`,
                                    headers: {'Authorization': key},
                                    failOnStatusCode: false
                                }).then((response) => {
                                    expect(response.status).to.eq(200)
                                    let classifications =  response.body.data.standards[0].classifications
                                    //TODO: comment this because probably "classificationswithrelations" can't be userd for OmniClass

                                    classifications.forEach((classification)=>{
                                        cy.request({
                                            url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/table/${table.number}/classificationswithrelations/${classification.number}`,
                                            headers: {'Authorization': key},
                                            //retryOnStatusCodeFailure: true,
                                            timeout: 85000,
                                            failOnStatusCode: false
                                        }).then((res) => {
                                            res = res.body.data.standards[0].classifications[0]
                                            expect(res).to.have.property('children')
                                            if(res.children){
                                                res.children.forEach((child)=>{
                                                    expect(child).to.have.keys('discussion','doesnotinclude','id','includes','mayinclude','notes','number','publishdate','synonyms','tableref','title','versionid')
                                                    expect(child.id).not.to.be.null
                                                    expect(child.number)//.not.to.be.null
                                                    if(!child.number){
                                                        count =count++;
                                                        cy.log(`null number for child found inside ${standard.name} - ${classification.number}`)
                                                    }
                                                    expect(child.publishdate).to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                                    expect(child.title).not.to.be.null
                                                    expect(child.versionid).not.to.be.null
                                                })
                                            }
                                            expect(res).to.have.property('crosswalks')
                                            expect(res).to.have.property('discussion')
                                            expect(res).to.have.property('doesnotinclude')
                                            expect(res).to.have.property('haschildren')
                                            expect(res).to.have.property('hasparents')
                                            expect(res).to.have.property('id').not.to.be.null
                                            expect(res).to.have.property('includes')
                                            expect(res).to.have.property('mayinclude')
                                            expect(res).to.have.property('notes')
                                            expect(res).to.have.property('number')//.not.to.be.null
                                            if(!res.number){
                                                count= count++;
                                                cy.log(" 🔔null number for classification found")
                                            }

                                            expect(res).to.have.property('otherversions')
                                            expect(res).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                            expect(res).to.have.property('see')
                                            expect(res).to.have.property('seealso')
                                            expect(res).to.have.property('synonyms')
                                            expect(res).to.have.property('tableref')
                                            expect(res).to.have.property('title').not.to.be.null
                                            expect(res).to.have.property('versionid')
                                        })
                                    })
                                })
                            })
                        })
                    break;
                    case "MasterFormat": case "UniFormat": case "MasterFormat 1995":  //for MasterFormat versions / UniFormat
                        cy.request({
                            url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/classifications`,
                            headers: {'Authorization': key},
                            failOnStatusCode: false
                        }).then((res) => {
                            expect(res.status).to.eq(200)
                            cy.log(standard.name)
                            expect(res.body.data.standards[0], "response should contains 'classifications'").to.have.property('classifications')//.not.null
                            let classifications =  res.body.data.standards[0].classifications
                            classifications.forEach((classification)=>{
                                if(classification.number){
                                    cy.request({
                                        url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/classificationswithrelations/${classification.number}`,
                                        headers: {'Authorization': key},
                                        timeout: 85000,
                                        failOnStatusCode: false
                                    }).then((res) => {
                                        res = res.body.data.standards[0].classifications[0]
                                        expect(res).to.have.property('children')
                                        if(res.children){
                                            res.children.forEach((child)=>{
                                                expect(child).to.have.keys('discussion','doesnotinclude','id','includes','mayinclude','notes','number','publishdate','synonyms','tableref','title','versionid')
                                                expect(child.id).not.to.be.null
                                                expect(child.number)//.not.to.be.null
                                                if(!child.number){
                                                    count= count++
                                                    cy.log(` 🔔null number for child found inside ${standard.name} - ${classification.number}`)
                                                }
                                                expect(child.publishdate).to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                                expect(child.title).not.to.be.null
                                                expect(child.versionid).not.to.be.null
                                            })
                                        }
                                        expect(res).to.have.keys('children','crosswalks','discussion','doesnotinclude','haschildren','hasparents','id','includes','mayinclude',
                                            'notes','number','otherversions','publishdate','see','seealso','synonyms','tableref','title','versionid')
                                        expect(res).to.have.property('number')//.not.to.be.null
                                        res.crosswalks.forEach((crosswalk)=>{
                                            expect(crosswalk).to.have.keys('discussion','doesnotinclude','haschildren','hasparents','id','includes','mayinclude',
                                                'notes','number','publishdate','relationship','standards','synonyms','tableref','title','versionid')
                                            expect(crosswalk.id).not.to.be.null
                                            expect(crosswalk.includes)//.not.to.be.null
                                            expect(crosswalk.number).not.to.be.null
                                            expect(crosswalk.relationship).not.to.be.null
                                            expect(crosswalk.title).not.to.be.null
                                            expect(crosswalk.versionid).not.to.be.null
                                            expect(crosswalk.publishdate).to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                        })
                                        if(!res.number){
                                            count= count++
                                            cy.log(" 🔔 null number for classification found")
                                        }

                                        expect(res).to.have.property('otherversions')
                                        expect(res).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                        expect(res).to.have.property('see')
                                        expect(res).to.have.property('seealso')
                                        expect(res).to.have.property('synonyms')
                                        expect(res).to.have.property('tableref')
                                        expect(res).to.have.property('title').not.to.be.null
                                        expect(res).to.have.property('versionid')
                                    })
                                }else{
                                    count= count++
                                    cy.log(` 🔔This entire classification has no number ${standard.name}`)
                                }
                            })
                        })
                    break;

                }
                cy.log(`Total de versionid nulls on ${standard.name} = ${count}`)
            })
            cy.log("Total de versionid nulls= "+count)
        })

    })

    it('Validate that requesting for an specific standard version we always get response for the closest one valid',()=> {
        cy.request({
            url: `${Cypress.config().baseUrl}/api/standards/MasterFormat`,      //this is needed to get "OmniClass Tables"
            headers: {'Authorization': key},
            failOnStatusCode: false
        }).then((res) => {
            let availabe_versions = []
            availabe_versions.push(res.body.data.standards[0].version)  //add current version
            res.body.data.standards[0].otherversions.forEach((otherVersion) => {
                availabe_versions.push(otherVersion.version)
            })
            console.log(availabe_versions)
            const current_year = Cypress.moment().format('YYYY')   //if I request for the current year, then I get the highest version of the standard
            cy.request({
                url: `${Cypress.config().baseUrl}/api/standards/MasterFormat/version/${current_year}`,      //this is needed to get "OmniClass Tables"
                headers: {'Authorization': key},
            }).then((res) => {
                let latest_version = Math.max(...availabe_versions)
                expect(res.body.data.standards[0].version).to.be.eq(`${latest_version}`)
            })
        })
    })

    it.only('Serching for classifications based on titles for all standards',()=>{
        const category = 'electrical'
        cy.getStandards().then((standards)=>{
            standards.forEach(standard=>{
                if(standard.name == "OmniClass"){
                    cy.getTables_OmniClass().then((tables)=>{
                        console.log(tables)
                        tables.forEach(table=>{
                            cy.request({
                                url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/table/${table.number}/classifications/search/${category}`,
                                headers: {'Authorization': key},
                                tiemeout: 850000
                            }).then((response)=>{
                                expect(response.status).eq(200)
                                expect(response).not.has.property('error')
                                const matches = response.body.data.standards[0].classifications
                                if(matches){
                                    matches.forEach(classification => {
                                        expect(classification).to.have.property('id').not.to.be.empty
                                        expect(classification).to.have.property('number').not.to.be.empty
                                        expect(classification).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                        expect(classification).to.have.property('versionid').not.to.be.empty
                                        expect(classification).to.have.property('title')//.to.contains(category)
                                    })
                                }
                            })
                        })
                    })
                }else{
                    cy.request({
                        url: `${Cypress.config().baseUrl}/api/standards/${standard.name}/classifications/search/electrical`,
                        headers: {'Authorization': key},
                        tiemeout: 850000
                    }).then((response)=>{
                        expect(response.status).eq(200)
                        expect(response).not.has.property('error')
                        const matches = response.body.data.standards[0].classifications
                        if(matches){
                            matches.forEach(classification => {
                                expect(classification).to.have.property('id').not.to.be.empty
                                expect(classification).to.have.property('number')//.not.to.be.empty
                                expect(classification).to.have.property('publishdate').to.match(/20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/)
                                expect(classification).to.have.property('versionid').not.to.be.empty
                                expect(classification).to.have.property('title')//.to.contains(category)
                            })
                        }
                    })
                }
            })
        })
    })
    it('x',()=>{
        let yourVariable = ['']
        yourVariable.should.satisfy(function (num) {
            if ((num === null) || (num === 5)) {
                return true;
            } else {
                return false;
            }
        });

    })

    it.skip('Using bad formed request url throws an 400 error code',()=> {
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

    it.skip('Querying for non-valid standard throws an 404 error code',()=> {
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