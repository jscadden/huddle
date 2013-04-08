Feature: User email verification
  As an admin
  I want a new user's email address to be verified
  So that I know I my users aren't bots

  Scenario: User receives a verification email on sign up
    Given I'm logged out
    When I register
    Then I should receive a verification email
    