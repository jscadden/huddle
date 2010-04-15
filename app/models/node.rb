class Node < ActiveRecord::Base
  has_ancestry
  belongs_to :user
  has_many :comments
  
  #attr_accessible :title, :description
  
  def comment_count
    comments.size
  end
end
