Feature: Uninvite a collaborator
  As a user
  I want to revoke an invitation to work on my tree
  So that I can control my trees

  Background:
    Given a user exists
    And a tree exists
    And an unaccepted invitation exists
    And a second user exists
    When I follow an invitation link
    And I fill out the login form as the second user
    And I press "Log in"
    Then I should see a collaboration invitation
    When I press "Accept"
    Then I should see the tree's title
    Then I log out

  Scenario: User revokes an invitation
    Given I'm logged in
    And I am on the trees index
    When I follow "Edit"
    And I check "tree_invitations_attributes_0__destroy"
    And I press "Save Huddle"
    And I log out
    Given I am on the login page
    And I fill out the login form as the second user
    And I press "Log in"
    Then I should not see a link to the invited tree

