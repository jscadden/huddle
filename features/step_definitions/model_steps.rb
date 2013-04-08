# if you have an adjective, consider making a specific rule to handle that
# adjective
Given /^an? (\S+) exists$/ do |model|
  Factory(model)
end

Given /^an unaccepted invitation exists$/ do 
  Factory("invitation", :recipient_id => nil)
end

Given /^a second user exists$/ do
  @second_user = Factory("user", 
                         :login => "user2", 
                         :email => "user2@realtimehuddle.com")
end

Given /^an accepted invitation exists$/ do
  recipient = Factory("user", 
                      :login => "invited_user",
                      :email => "invited_user@realtimehuddle.com")
  @accepted_invitation = newest_invitation
  @accepted_invitation.recipient = recipient # attr is protected
  @accepted_invitation.save!
  Invitation.accepted.should include(@accepted_invitation)
end

Given /^a public tree exists$/ do
  Factory("tree", :public => true)
end
