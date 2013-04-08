When /^I register$/ do
  visit(logout_path)
  visit(register_path)
  fill_in("Login", :with => "test_user")
  fill_in("Email", :with => "example@example.com")
  fill_in("Password", :with => "password")
  fill_in("Password confirmation", :with => "password")
  click_button("Register")
end

When /^I follow the verification link in the verification email$/ do
  open_email("example@example.com", 
             :with_subject => /^Please verify your account/)
  click_email_link_matching(/users\/verify/)
end

