class Tree < ActiveRecord::Base
  belongs_to :user
  belongs_to :node
  
  accepts_nested_attributes_for :node
end
