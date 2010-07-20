Feature: Public Trees
  As a user
  I want to mark my Trees as public
  So that I can share them with random people, who don't need to sign up in order to view them.

  Scenario: User marks a tree as public
    Given a tree exists
    And I'm logged in
    When I mark the tree as public
    Then I should see an indicator that the tree is public

  Scenario: User marks a tree as private
    Given a tree exists
    And I'm logged in
    When I mark the tree as private
    Then I should not see an indicator that the tree is public

  Scenario: Another user views a public tree
    Given a public tree exists
    And a second user exists
    And I'm logged in as the second user
    When I visit the public tree
    Then I should see the public tree's title

  Scenario: A stranger tries to edit a public tree
    Given a public tree exists
    And I'm logged out
    When I visit the public tree
    Then I should see the tree's title
    And I should not see a reply link
