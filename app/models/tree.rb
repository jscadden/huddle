class Tree < ActiveRecord::Base
  belongs_to :user
  belongs_to :node, :dependent => :destroy

  validates_presence_of :node_id
  validates_presence_of :user_id
end
