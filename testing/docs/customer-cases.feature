# Design worksheet: Playwright Test does not execute .feature files.
# Exact LIVE expectations must be confirmed by a human after observation.
Feature: Customer search cases
  @U01
  Scenario: See autocomplete suggestions
    Given I have opened the approved address finder
    When I type "122 kerwyn"
    Then I see an appropriate suggestion before submitting
    And selecting it opens the matching result

  @U02
  Scenario: Filter locations by service
    Given I have a reviewed unfiltered location search
    When I choose "Pay a bill"
    Then the results meet the selected service
    And removing the filter restores the eligible results

  @U03
  Scenario: Reject an unknown address
    Given I have just viewed a successful address search
    When I search for "172863 aksdhj"
    Then I see the agreed no-match outcome
    And I do not see the old successful result

  Scenario Outline: Find the requested kind of address or location
    Given I have opened the finder agreed for this case
    When I search for "<query>"
    Then I see the reviewed matching result for "<case>"

    Examples:
      | case | query                               |
      | U04  | Private Bag 37006, Te Karaka 4042     |
      | U05  | PO Box 101, Paihia 0247              |
      | U06  | Auckland Central, Auckland          |
