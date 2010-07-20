class User < ActiveRecord::Base
  include User::Authentication
  include User::Authorization

  has_many :trees
  has_many :nodes
end
