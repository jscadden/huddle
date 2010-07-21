Feature: Invite a collaborator
  As a user
  I want to invite others to work on my tree
  So that we can share ideas

  Background:
    Given a user exists
    And no emails have been sent
    And a tree exists

  Scenario: User goes to the invite a collaborator form
    Given I'm logged in
    And I am on the trees index
    When I follow "Invite A Collaborator"
    Then I should see the invite a collaborator form

  Scenario: User invites a collaborator
    Given I'm logged in
    And I am on the trees index
    When I follow "Invite A Collaborator"
    And I fill in the invite a collaborator form
    And I press "Invite"
    Then I should see a flash notice matching "Invitation sent"
    And an invitation email should be sent
    And the invitation email should include an invitation link

  Scenario: Anonymous user accepts an invitation
    Given an unaccepted invitation exists
    When I follow an invitation link
    And I fill out the signup form
    And I press "Register"
    And I follow the verification link in the verification email
    Then I should see a collaboration invitation
    When I press "Accept"
    Then I should see the tree's title
    
  Scenario: Existing user accepts an invitation
    Given an unaccepted invitation exists
    And a second user exists
    When I follow an invitation link
    And I fill out the login form as the second user
    And I press "Log in"
    Then I should see a collaboration invitation
    When I press "Accept"
    Then I should see the tree's title
    
  Scenario: User accepts his own invitation
    Given an unaccepted invitation exists
    And I'm logged in
    When I follow an invitation link
    Then I should see a collaboration invitation
    When I press "Accept"
    Then I should see an explanation of the invitation acceptance failure
    
  Scenario: User invites a user twice
    Given an unaccepted invitation exists
    And I'm logged in
    And I am on the trees index
    And I follow "Invite A Collaborator"
    When I fill in the invite a collaborator form to invite the same user
    And I press "Invite"
    Then I should see an explanation of the invitation creation failure

  Scenario: Invited user should see a collaborator's tree in her index
    Given an accepted invitation exists
    And I'm logged in as the invitation's recipient
    When I am on the trees index
    Then I should see a link to the invitation's tree

  Scenario: User invites a collaborator (read-only)
    Given I'm logged in
    And I am on the trees index
    When I follow "Invite A Collaborator"
    And I fill in the invite a collaborator form
    And I check "Read only"
    And I press "Invite"
    Then I should see a flash notice matching "Invitation sent"
    And an invitation email should be sent
    And the invitation email should include an invitation link
