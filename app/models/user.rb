class User < ActiveRecord::Base
  include User::Authentication

  has_many :trees
  has_many :nodes
end
