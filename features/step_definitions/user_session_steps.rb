Given /^I\'m logged out$/ do
  visit(logout_path)
end

Given /^I\'m logged in$/ do
  user = User.first || Factory("user")
  visit(login_path)
  fill_in("Login", :with => user.login)
  fill_in("Password", :with => user.password || "password")
  click_button("Log in")
  # TODO: add a quick assertion here
end
