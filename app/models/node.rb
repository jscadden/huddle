class Node < ActiveRecord::Base
  has_ancestry
  belongs_to :user
  has_many :comments
  has_many :viewers
  
  #attr_accessible :title, :description
  
  def comment_count
    comments.size
  end
  
  def viewed_by(viewingUser)
    self.viewers.create(:user => viewingUser, :node => self) unless viewed_by_user(viewingUser)    
  end
  
  def viewed_by_user(viewingUser)
    viewed = viewers && self.viewers.exists?(:user_id => viewingUser)
  end
  
  def to_hash(viewingUser)
    node_hash = self.attributes
    node_hash[:comment_count] = self.comment_count
    node_hash[:parent_id] = self.parent_id
    node_hash[:user] = {:login => self.user.login}
    node_hash[:viewed_by_user] = self.viewed_by_user(viewingUser)
    return {:node => node_hash}
  end
end
