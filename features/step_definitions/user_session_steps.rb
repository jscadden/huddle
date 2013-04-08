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

Given /^I\'m logged in as the invitation\'s recipient$/ do
  user = newest_invitation.recipient
  visit(login_path)
  fill_in("Login", :with => user.login)
  fill_in("Password", :with => user.password || "password")
  click_button("Log in")
  # TODO: add a quick assertion here
end

Given /^I\'m logged in as the second user$/ do
  visit(login_path)
  fill_in("Login", :with => @second_user.login)
  fill_in("Password", :with => @second_user.password || "password")
  click_button("Log in")
  # TODO: add a quick assertion here
end

When /^I log out$/ do
  visit(logout_path)
  visit(root_path)
end
