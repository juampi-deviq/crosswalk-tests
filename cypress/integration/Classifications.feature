Feature: Get parent and children classifications

  #Scenario 1
  Scenario: Get the classifications grouped by children for MasterForm 2018
    Given A query for MasterForm 2018 with "08 00 00" classifications
    When I send the request
    Then I get all the available child classifications for "08 00 00"
#
##  #Scenario 2
  Scenario: Validate the server response when quering for non-existing child classifications
    Given A query for "OmniClass" without specific version
    When I send the request
    Then I get no errors on children property for classifications

  #Scenario
  Scenario: Get the classifications grouped by children for MasterFormat latest version without any classification
    Given A query for "MasterFormat" standard without specific classifications and version
    When I send the request
    Then I get all the available classifications and his child
#  COMMENTS:
#   using a bad standard name I don't get any explicit advise (only get a null 'standard' object)
#   using just OmniClass in id I get an null object "classifications" (and an error object with message "Error trying to resolve classifications"). Its mandaroty to add table attribute on request?


  #Scenario 4
  Scenario: Get children for a standard classification
    Given A query for children of "MasterFormat" and his subchildren
    When I send the request
    Then I get valid data for children and subchildren classifications
#
##  #Scenario 5
  Scenario: Get children for a standard classification across other versions
    Given A query for children of OmniClass and his subchildren
    When I send the request
    Then I get valid data for children and subchildren classifications across standard versions
#
#  #Scenario 6
  Scenario: Get always the latest version of the standard if there is no specific version requested
    Given A query for classifications with non specific standard version
    When I send the request
    Then I get data from the latest version of the standard

  #Scenario 7
  Scenario: Be able to get other versions of any standard
    Given A query asking for other versions of a standard
    When I send the request
    Then I get data for other existing versions of the standard

#  Scenario 8
#  Scenario: -- to confir "See"
#
#  #Scenario 9
#  Scenario: "SeeAlso"

  #Scenario 10
  Scenario: Using crosswalk to get equivalency for a classification in another standard