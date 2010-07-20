class Tree < ActiveRecord::Base
  belongs_to :user
  belongs_to :node, :dependent => :destroy
  has_many :invitations, :dependent => :destroy

  with_options(:class_name => "Invitation") do |i|
    i.has_many :ro_invitations, :conditions => {:read_only => true}
    i.has_many :rw_invitations, :conditions => {:read_only => false}
  end

  validates_presence_of :node_id
  validates_presence_of :user_id

  delegate :title, :to => :node

  accepts_nested_attributes_for :invitations, :allow_destroy => true
end
