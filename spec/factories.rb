Factory.define "user" do |f|
  f.login "user"
  f.email "user@realtimehuddle.com"
  f.password "password"
  f.password_confirmation "password"
end

Factory.define "tree" do |f|
  f.user {|f| User.first || f.association("user")}
  f.association(:node)
end

Factory.define "node" do |f|
  f.title "Test Title"
  f.description "Test Description"
  f.user {|f| User.first || f.association("user")}
end

Factory.define "invitation" do |f|
  f.sender {|f| User.first || f.association("user")}
  f.recipient_email "example@example.com"
  f.tree {|f| Tree.first || f.association("tree")}
end

