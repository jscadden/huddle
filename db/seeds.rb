# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)

bob = User.create!(:login => "bob",
                    :email => "bob@xambini.com",
                    :role => "user",
                    :verified_at => Time.now,
                    :password => "password",
                    :password_confirmation => "password")
                    
user = User.create!(:login => "user",
                    :email => "user@xambini.com",
                    :role => "user",
                    :verified_at => Time.now,
                    :password => "password",
                    :password_confirmation => "password")

node = Node.new do |n|
  n.title = "Thoughts on our new benefits package"
  n.description = "As a company, we will be putting together a new benefits package.  What would everyone like to see added or taken out from what we currently have."
  n.user = user
  n.is_root = true
end
node.save!

node_with_comments = node.children.create!(:title => "More choices of doctors",
                          :description => "Our current plan doesn't have any of the doctors that I like to see.  Can we choose a plan that has a larger network of doctors.",
                          :user => user)
node.children.create!(:title => "Gym Membership",
                          :description => "It would be awesome to provide a Gym membership.",
                          :user => user)       
node.children.create!(:title => "Premiums Paid",
                          :description => "The Premiums are getting expensive.  Lets see the company pay 100% of the premiums.",
                          :user => user)  
node_with_comments.comments.create!(:description => "I agree.  We really need this",
                                    :user => user)                                  
