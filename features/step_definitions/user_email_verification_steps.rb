Then /^I should receive a verification email$/ do
  unread_emails_for("example@example.com").size.should == 1
end

Then /^the invitation email should include a verification url$/ do
  open_email("example@example.com")
  current_email.body.should match(/http:\/\/.+\/users\/verify/i)
end
