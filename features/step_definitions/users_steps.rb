When /^I fill out the signup form$/ do
  fill_in("Login", :with => "test user")
  fill_in("Email", :with => "example@example.com")
  fill_in("Password", :with => "password")
  fill_in("Password confirmation", :with => "password")
end
