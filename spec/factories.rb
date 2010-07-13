Factory.define "user" do |f|
  f.login "user"
  f.email "user@realtimehuddle.com"
  f.password "password"
  f.password_confirmation "password"
end

Factory.define "tree" do |f|
  f.user {|f| User.first || f.association("user")}
end

Factory.define "node" do |f|
  f.title "Test Title"
  f.description "Test Description"
end
