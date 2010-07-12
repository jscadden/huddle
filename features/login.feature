Feature: Log in
  As a user
  I want to log in to the site
  So that I can work on my huddle docs

  Background:
    Given a user exists

  @sanity
  Scenario: User logs in
    Given I am on the root page
    When I am on the login page
    And I fill in "Login" with "user"
    And I fill in "Password" with "password"
    And I press "Log in"
    Then I should see "My Huddles"
