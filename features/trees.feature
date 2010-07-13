Feature: Trees
  As a user
  I want to create new huddle trees
  So that I can arrange my ideas and get user feedback

  Scenario: User creates a tree
    Given I'm logged in
    When I go to the new tree page
    And I fill in "Title" with "My new tree"
    And I press "Create Huddle"
    Then I should see my new tree's root node
    