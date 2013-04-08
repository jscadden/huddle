Then /^I should see the invite a collaborator form$/ do
  page.should have_css("form#new_invitation")
end

When /^I fill in the invite a collaborator form$/ do
  fill_in("Recipient email", :with => "example@example.com")
end

Then /^an invitation email should be sent$/ do
  unread_emails_for("example@example.com").size.should == 1
end

Then /^the invitation email should include an invitation link$/ do
  open_email("example@example.com")
  current_email.body.should match(/http:\/\/.+\/invitations\/[\w\d\-]{20}/i)
end

When /^I follow an invitation link$/ do
  visit(invitation_path(newest_invitation))
end

Then /^I should see a collaboration invitation$/ do
  page.should have_css("form.edit_invitation")
  page.should have_css("input[type=submit][value='Accept']")
end

When /^I fill out the login form as the second user$/ do
  within("form#new_user_session") do
    fill_in("Login", :with => @second_user.login)
    fill_in("Password", :with => @second_user.password || "password")
  end
end

Then /^I should see an explanation of the invitation acceptance failure$/ do
  within("#errorExplanation p") do
    page.should have_content("There were problems with the following fields:")
  end
  page.should have_content("may not be the same as the sender")
end

When /^I fill in the invite a collaborator form to invite the same user$/ do
  fill_in("Recipient email", :with => newest_invitation.recipient_email)
end

Then /^I should see an explanation of the invitation creation failure$/ do
  within("#errorExplanation p") do
    page.should have_content("There were problems with the following fields:")
  end
  page.should have_content("has already been invited")
end

Then /^I should see a link to the invitation\'s tree$/ do
  page.should have_css("a[href='#{tree_path(newest_invitation.tree)}']")
end
